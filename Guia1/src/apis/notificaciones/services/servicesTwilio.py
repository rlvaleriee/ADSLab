from twilio.rest import Client
from config.config import app_config

current_config = app_config['development']

client = Client(current_config.TWILIO_ACCOUNT_SID, current_config.TWILIO_AUTH_TOKEN)

def send_whatsapp_message(to_number: str, message: str) -> str:
    msg = client.messages.create(
        body=message,
        from_=f"whatsapp:{current_config.TWILIO_WHATSAPP_NUMBER}",
        to=f"whatsapp:{to_number}"
    )
    return msg.sid
