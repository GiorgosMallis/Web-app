import requests
import os
import base64
from nacl import encoding, public

def encrypt(public_key: str, secret_value: str) -> str:
    """Encrypt a Unicode string using the public key."""
    public_key = public.PublicKey(public_key.encode("utf-8"), encoding.Base64Encoder())
    sealed_box = public.SealedBox(public_key)
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

def add_secret(token: str, repo: str, secret_name: str, secret_value: str):
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': f'token {token}'
    }

    # Get the public key for the repo
    key_response = requests.get(f'https://api.github.com/repos/{repo}/actions/secrets/public-key', headers=headers)
    key_data = key_response.json()

    encrypted_value = encrypt(key_data['key'], secret_value)

    # Create or update the secret
    secret_data = {
        'encrypted_value': encrypted_value,
        'key_id': key_data['key_id']
    }
    
    response = requests.put(
        f'https://api.github.com/repos/{repo}/actions/secrets/{secret_name}',
        headers=headers,
        json=secret_data
    )
    
    if response.status_code in [201, 204]:
        print(f"Successfully added secret {secret_name}")
    else:
        print(f"Failed to add secret {secret_name}: {response.status_code} {response.text}")

# Get GitHub token from environment
token = input("Enter your GitHub Personal Access Token: ")
repo = "GiorgosMallis/Web-app"

secrets = {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyCTu_Bwa5465msaQy2g2dvlsg1V2F3l1N8",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "mobile-web-app-be087.firebaseapp.com",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "mobile-web-app-be087",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "mobile-web-app-be087.firebasestorage.app",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "977622636779",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "1:977622636779:web:c4aaff2362b15ea24bc6ae"
}

for name, value in secrets.items():
    add_secret(token, repo, name, value)
