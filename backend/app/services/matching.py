from typing import List

def calculate_match_score(user_skills: List[str], team_requirements: List[str]) -> int:
    """
    Returns a score (0-100) based on skill overlap.
    """
    if not team_requirements:
        return 0
        
    # Convert to sets for easy math
    user_set = set(s.lower() for s in user_skills)
    req_set = set(r.lower() for r in team_requirements)
    
    # Find overlap
    matches = user_set.intersection(req_set)
    
    # Calculate percentage
    score = (len(matches) / len(req_set)) * 100
    return int(score)