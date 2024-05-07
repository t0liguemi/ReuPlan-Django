import secrets
import string

def generate_random_string():
    alphabet = string.ascii_uppercase
    return ''.join(secrets.choice(alphabet) for _ in range(8))