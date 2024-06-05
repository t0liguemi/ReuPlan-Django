import secrets
import string

def generate_random_string(length):
    alphabet = string.ascii_uppercase
    return ''.join(secrets.choice(alphabet) for _ in range(length))