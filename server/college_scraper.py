import trafilatura
import re
import json
import time
from urllib.parse import urlparse, urljoin
import requests
from bs4 import BeautifulSoup

def extract_domain(url):
    """Extract the domain from a URL."""
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    if domain.startswith('www.'):
        domain = domain[4:]
    return domain

def get_college_name(text, domain, soup=None):
    """Extract college name from text and domain."""
    # First, check for common title elements if soup is provided
    if soup:
        # Check meta tags
        meta_title = soup.find('meta', property='og:site_name')
        if meta_title and meta_title.get('content'):
            return meta_title['content']
            
        # Check title tag
        title_tag = soup.find('title')
        if title_tag and title_tag.text:
            # Clean up title
            title = title_tag.text.strip()
            # Remove common title suffixes like " - Home" or " | Official Website"
            title = re.sub(r'\s+[-|]\s+.*$', '', title)
            # If title is reasonably short, it's likely to be the college name
            if len(title) < 50:
                return title
    
    # Try to find common patterns for college names
    college_patterns = [
        r"(University of [A-Z][a-z]+ [A-Z][a-z]+)",
        r"(University of [A-Z][a-z]+)",
        r"([A-Z][a-z]+ [A-Z][a-z]+ University)",
        r"([A-Z][a-z]+ University)",
        r"([A-Z][a-z]+ College)",
        r"([A-Z][a-z]+ State University)",
        r"(College of [A-Z][a-z]+)"
    ]
    
    for pattern in college_patterns:
        matches = re.findall(pattern, text)
        if matches:
            return matches[0]
    
    # Fallback to domain-based name
    parts = domain.split('.')
    if len(parts) >= 2:
        domain_name = parts[0]
        # Convert domain name to title case and replace hyphens with spaces
        return domain_name.replace('-', ' ').title()
    
    return "Unknown College"

def get_college_logo(soup, base_url):
    """Try to extract college logo URL from webpage."""
    try:
        potential_logos = []
        
        # Check for image with 'logo' in the class or id
        logo_imgs = soup.select('img[class*="logo"], img[id*="logo"], img[alt*="logo"], img[src*="logo"]')
        potential_logos.extend([img.get('src', '') for img in logo_imgs])
        
        # Check header/navbar for logos
        header_logos = soup.select('header img, .header img, .navbar img, nav img, .brand img, .logo img')
        potential_logos.extend([img.get('src', '') for img in header_logos])
        
        # Filter out empty or invalid URLs
        potential_logos = [logo for logo in potential_logos if logo and not logo.startswith('data:')]
        
        if potential_logos:
            logo_url = potential_logos[0]
            # Handle relative URLs
            if logo_url.startswith('/'):
                logo_url = urljoin(base_url, logo_url)
            elif not logo_url.startswith(('http://', 'https://')):
                logo_url = urljoin(base_url, logo_url)
            return logo_url
        
        return None
    except Exception as e:
        # Don't print error to stdout to avoid interfering with JSON output
        return None

def guess_division(text, soup=None):
    """Guess the NCAA division from text."""
    if soup:
        # Look for more specific division indicators
        division_elements = soup.select('*:contains("Division I"), *:contains("Division II"), *:contains("Division III"), *:contains("NCAA I"), *:contains("NCAA II"), *:contains("NCAA III")')
        
        for element in division_elements:
            element_text = element.get_text()
            if "Division I" in element_text or "NCAA I" in element_text or "NCAA Division I" in element_text:
                return "Division I"
            elif "Division II" in element_text or "NCAA II" in element_text or "NCAA Division II" in element_text:
                return "Division II"
            elif "Division III" in element_text or "NCAA III" in element_text or "NCAA Division III" in element_text:
                return "Division III"
    
    # Fallback to text search
    if "Division I" in text or "NCAA Division I" in text or "NCAA I" in text or "DI" in text:
        return "Division I"
    elif "Division II" in text or "NCAA Division II" in text or "NCAA II" in text or "DII" in text:
        return "Division II"
    elif "Division III" in text or "NCAA Division III" in text or "NCAA III" in text or "DIII" in text:
        return "Division III"
    else:
        return "Unknown"

def extract_coach_info(text, soup=None):
    """Extract coach information from text and/or soup."""
    coach_name = None
    coach_photo = None
    coach_bio = None
    
    # Try to find coach name in the text
    coach_patterns = [
        r"Head Coach:?\s+([A-Z][a-z]+ [A-Z][a-z]+)",
        r"Coach:?\s+([A-Z][a-z]+ [A-Z][a-z]+)",
        r"([A-Z][a-z]+ [A-Z][a-z]+)\s+[-–•]\s+Head Coach",
        r"([A-Z][a-z]+ [A-Z][a-z]+)\s+[-–•]\s+Coach",
        r"([A-Z][a-z]+ [A-Z][a-z]+)(?:\s+is|\s+has been)\s+(?:the|a)\s+(?:head\s+)?coach"
    ]
    
    for pattern in coach_patterns:
        matches = re.findall(pattern, text)
        if matches:
            coach_name = matches[0]
            break
    
    # Try to extract coach bio from the text
    if coach_name:
        # Look for paragraphs that mention the coach name and might be a bio
        coach_first_name = coach_name.split()[0]
        coach_last_name = coach_name.split()[-1]
        
        # Find paragraphs mentioning the coach
        bio_sentences = []
        
        paragraphs = re.split(r'\n\s*\n', text)
        for paragraph in paragraphs:
            if coach_last_name in paragraph and len(paragraph.split()) > 15:
                bio_sentences.append(paragraph.strip())
                if len(bio_sentences) >= 2:  # Limit to 2 paragraphs max
                    break
        
        if bio_sentences:
            coach_bio = " ".join(bio_sentences)
    
    # If soup is provided, try more specific searches
    if soup:
        # Look for coach section
        coach_sections = soup.select('.coach, .staff, .coaching-staff, #coach, #coaches, *[id*="coach"], *[class*="coach"], .bio, .biography, .profile')
        
        for section in coach_sections:
            # Check if we already found a name
            if coach_name:
                # Try to find an image in the same section
                img = section.find('img')
                if img and img.get('src'):
                    src = img['src']
                    if not src.startswith(('http://', 'https://')):
                        parsed_url = urlparse(soup.url if hasattr(soup, 'url') else '')
                        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                        src = urljoin(base_url, src)
                    coach_photo = src
                    
                    # If we don't have a bio yet, try to find it in this section
                    if not coach_bio:
                        # Get the text from this section, excluding navigation elements
                        for nav in section.select('nav, .nav, .navigation, .menu'):
                            nav.decompose()
                        section_text = section.get_text().strip()
                        if len(section_text.split()) > 20:  # Only use as bio if it's substantial
                            coach_bio = section_text
                    
                    break
            else:
                # Try to find name in this section
                section_text = section.get_text()
                for pattern in coach_patterns:
                    matches = re.findall(pattern, section_text)
                    if matches:
                        coach_name = matches[0]
                        # Look for an image
                        img = section.find('img')
                        if img and img.get('src'):
                            src = img['src']
                            if not src.startswith(('http://', 'https://')):
                                parsed_url = urlparse(soup.url if hasattr(soup, 'url') else '')
                                base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                                src = urljoin(base_url, src)
                            coach_photo = src
                        
                        # Try to extract bio from this section
                        for nav in section.select('nav, .nav, .navigation, .menu'):
                            nav.decompose()
                        clean_section_text = section.get_text().strip()
                        if len(clean_section_text.split()) > 20:  # Only use as bio if it's substantial
                            coach_bio = clean_section_text
                        
                        break
    
    # Clean up the bio if we found one
    if coach_bio:
        # Remove excessive whitespace
        coach_bio = re.sub(r'\s+', ' ', coach_bio).strip()
        # Limit to a reasonable length
        if len(coach_bio) > 500:
            coach_bio = coach_bio[:497] + "..."
    
    return coach_name, coach_photo, coach_bio

def find_team_info(text, soup=None):
    """Extract team roster and schedule information."""
    roster = []
    schedule = []
    
    # Look for potential roster information using pattern matching
    # Match names with years (Fr., So., Jr., Sr.)
    name_patterns = [
        r'([A-Z][a-z]+(?: [A-Z][a-z]+)+)\s+[•·-]\s+(Fr\.|So\.|Jr\.|Sr\.)',
        r'([A-Z][a-z]+(?: [A-Z][a-z]+)+)\s+[•·-]\s+(Freshman|Sophomore|Junior|Senior)',
        r'([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\s+\|\s+|\s+[•·-]\s+)(?:[A-Z][a-z]+)(?:\s+\|\s+|\s+[•·-]\s+)(Fr\.|So\.|Jr\.|Sr\.)'
    ]
    
    for pattern in name_patterns:
        roster_matches = re.findall(pattern, text)
        if roster_matches:
            for match in roster_matches[:15]:  # Limit to first 15 matches
                name = match[0]
                year = match[1]
                
                # Standardize year format
                if year.lower() in ('freshman', 'fr.'):
                    year = 'Fr.'
                elif year.lower() in ('sophomore', 'so.'):
                    year = 'So.'
                elif year.lower() in ('junior', 'jr.'):
                    year = 'Jr.'
                elif year.lower() in ('senior', 'sr.'):
                    year = 'Sr.'
                
                roster.append({
                    "name": name,
                    "year": year,
                    "position": "Diver"  # Default position
                })
            
            # If we found some roster members, stop searching
            if roster:
                break
    
    # Try to extract roster from HTML if soup is provided
    if soup and (not roster or len(roster) < 5):
        # Look for tables or lists that might contain roster
        roster_elements = soup.select('table.roster, table[class*="roster"], div[class*="roster"], ul[class*="roster"]')
        
        if roster_elements:
            for element in roster_elements:
                # Extract text from this element
                element_text = element.get_text()
                
                # Apply our patterns again on this specific element
                for pattern in name_patterns:
                    element_matches = re.findall(pattern, element_text)
                    for match in element_matches[:20]:
                        name = match[0]
                        year = match[1]
                        
                        # Standardize year format
                        if year.lower() in ('freshman', 'fr.'):
                            year = 'Fr.'
                        elif year.lower() in ('sophomore', 'so.'):
                            year = 'So.'
                        elif year.lower() in ('junior', 'jr.'):
                            year = 'Jr.'
                        elif year.lower() in ('senior', 'sr.'):
                            year = 'Sr.'
                        
                        # Check if this name is already in the roster
                        if not any(r['name'] == name for r in roster):
                            roster.append({
                                "name": name,
                                "year": year,
                                "position": "Diver"
                            })
    
    # Look for potential schedule information
    # This pattern captures dates with month, day, and year
    schedule_patterns = [
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\.a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]+(\d{4})',
        r'(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})',  # Matches dates like 01/15/2023
        r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})'     # Matches dates like 2023-01-15
    ]
    
    for pattern in schedule_patterns:
        schedule_matches = re.findall(pattern, text)
        if schedule_matches:
            for match in schedule_matches[:8]:  # Limit to first 8 matches
                # Format depends on which pattern matched
                if len(match) == 3 and match[0] in ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'):
                    date_str = f"{match[0]} {match[1]}, {match[2]}"
                elif len(match) == 3 and match[0].isdigit() and match[1].isdigit() and match[2].isdigit():
                    if len(match[0]) == 4:  # YYYY-MM-DD format
                        date_str = f"{match[1]}/{match[2]}/{match[0]}"
                    else:  # MM/DD/YYYY format
                        date_str = f"{match[0]}/{match[1]}/{match[2]}"
                else:
                    continue  # Skip if format doesn't match expectations
                
                # Look for opponent near the date
                date_idx = text.find(match[0])
                if date_idx >= 0:
                    context = text[max(0, date_idx-50):date_idx+50]
                    vs_pattern = r'(?:vs\.?|against|@)\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*)'
                    opponent_match = re.search(vs_pattern, context)
                    opponent = opponent_match.group(1) if opponent_match else "TBD"
                else:
                    opponent = "TBD"
                
                schedule.append({
                    "date": date_str,
                    "opponent": opponent,
                    "location": "TBD"
                })
            
            # If we found some schedule items, stop searching
            if schedule:
                break
    
    return roster, schedule

def find_swimming_diving_page(base_url):
    """Attempt to find the swimming/diving team page from the main college URL."""
    try:
        # Start by fetching the base URL
        response = requests.get(base_url, timeout=8)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Common paths to athletics/sports pages
        potential_paths = [
            '/athletics', '/sports', '/varsity-sports', '/athletics/sports',
            '/athletics/varsity-sports', '/teams', '/varsity-teams'
        ]
        
        # Look for links to athletics section
        athletics_links = []
        
        # Look for links with athletics-related text
        for a in soup.find_all('a', href=True):
            a_text = a.get_text().lower()
            a_href = a['href'].lower()
            
            # Check if this is a link to athletics section
            if ('athletics' in a_text or 'sports' in a_text or 'teams' in a_text or 
                any(path in a_href for path in potential_paths)):
                
                href = a['href']
                if href.startswith('/'):
                    href = urljoin(base_url, href)
                elif not href.startswith(('http://', 'https://')):
                    href = urljoin(base_url, href)
                
                if href not in athletics_links and is_same_domain(base_url, href):
                    athletics_links.append(href)
        
        # If we don't have any links, try constructing them
        if not athletics_links:
            for path in potential_paths:
                athletics_links.append(urljoin(base_url, path))
        
        # Now look for swimming/diving links on each athletics page
        swimming_links = []
        
        for athletics_url in athletics_links[:3]:  # Limit to first 3 to avoid too many requests
            try:
                athletics_response = requests.get(athletics_url, timeout=8)
                athletics_soup = BeautifulSoup(athletics_response.text, 'html.parser')
                
                # Look for links to swimming/diving
                for a in athletics_soup.find_all('a', href=True):
                    a_text = a.get_text().lower()
                    a_href = a['href'].lower()
                    
                    swimming_terms = ['swimming', 'diving', 'swim', 'dive', 'aquatics']
                    
                    if any(term in a_text for term in swimming_terms) or any(term in a_href for term in swimming_terms):
                        href = a['href']
                        if href.startswith('/'):
                            href = urljoin(athletics_url, href)
                        elif not href.startswith(('http://', 'https://')):
                            href = urljoin(athletics_url, href)
                        
                        if href not in swimming_links and is_same_domain(base_url, href):
                            swimming_links.append(href)
                
                # If we found swimming links, no need to check more athletics pages
                if swimming_links:
                    break
                    
            except Exception as e:
                # Don't print error to stdout to avoid interfering with JSON output
                continue
        
        # Return the first swimming link, or None if none found
        return swimming_links[0] if swimming_links else None
    
    except Exception as e:
        # Don't print error to stdout to avoid interfering with JSON output
        return None

def is_same_domain(url1, url2):
    """Check if two URLs are from the same domain."""
    domain1 = extract_domain(url1)
    domain2 = extract_domain(url2)
    return domain1 == domain2 or domain1.endswith('.' + domain2) or domain2.endswith('.' + domain1)

def handle_url(url):
    """Validate, clean URL and determine if we need to search for swimming page."""
    # Make sure URL has protocol
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Parse URL
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    path = parsed_url.path
    
    # Check if the URL is likely already a team page
    swimming_terms = ['swimming', 'diving', 'swim', 'dive', 'aquatics']
    if any(term in path.lower() for term in swimming_terms):
        return url, False  # No need to search for swimming page
    
    # Check if URL is just a domain or has a minimal path
    if not path or path == '/' or path in ['/index.html', '/home', '/main']:
        return url, True  # Need to search for swimming page
    
    # Heuristic: If URL has a deep path (more than 2 levels), it's likely not a swimming page
    path_parts = [p for p in path.split('/') if p]
    if len(path_parts) > 2:
        if not any(term in path.lower() for term in swimming_terms):
            return url, True  # Deep path without swimming terms, search for swimming page
    
    # Default: try using the URL as is
    return url, False

def scrape_college_info(url):
    """
    Scrape college website and return relevant information.
    
    Args:
        url: The college website URL
        
    Returns:
        dict: College information including name, logo, division, and team data
    """
    try:
        # Handle the URL
        url, need_search = handle_url(url)
        
        # If we need to search for the swimming page
        if need_search:
            swimming_url = find_swimming_diving_page(url)
            if swimming_url:
                url = swimming_url
                # Don't print to stdout as it interferes with JSON output
                pass
            else:
                # Don't print to stdout as it interferes with JSON output
                pass
        
        # Fetch the page
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get the base URL for resolving relative links
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        # Extract text content for pattern matching
        downloaded = trafilatura.fetch_url(url)
        text = trafilatura.extract(downloaded) or ""
        if not text and soup:
            # Fallback to BeautifulSoup text extraction if trafilatura fails
            text = soup.get_text()
        
        # Get domain for fallback information
        domain = extract_domain(url)
        
        # Extract college information
        college_name = get_college_name(text, domain, soup)
        college_logo = get_college_logo(soup, base_url)
        division = guess_division(text, soup)
        coach_name, coach_photo, coach_bio = extract_coach_info(text, soup)
        roster, schedule = find_team_info(text, soup)
        
        # Count number of divers
        num_divers = len(roster)
        
        # Construct response
        response = {
            "success": True,
            "college": {
                "name": college_name,
                "url": url,
                "logo": college_logo,
                "division": division,
                "coachName": coach_name,
                "coachPhoto": coach_photo,
                "coachBio": coach_bio,
                "numberOfDivers": num_divers
            },
            "team": {
                "roster": roster,
                "schedule": schedule
            }
        }
        
        return response
    except Exception as e:
        # Don't print to stdout as it interferes with JSON output
        return {
            "success": False,
            "error": str(e)
        }

# Command line usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        url = sys.argv[1]
        result = scrape_college_info(url)
        print(json.dumps(result, indent=2))
    else:
        # Test with a default URL if none provided
        test_url = "stanford.edu"  # Just the domain to test auto-discovery
        result = scrape_college_info(test_url)
        print(json.dumps(result, indent=2))