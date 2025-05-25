from decouple import config


class Config:
    SECRET_KEY = config('SECRET_KEY')
    TWILIO_ACCOUNT_SID = config('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = config('TWILIO_AUTH_TOKEN')
    TWILIO_WHATSAPP_NUMBER = config('TWILIO_WHATSAPP_NUMBER')

    PGSQL_HOST = config('PGSQL_HOST')
    PGSQL_USER = config('PGSQL_USER')
    PGSQL_PASSWORD = config('PGSQL_PASSWORD')
    PGSQL_DATABASE = config('PGSQL_DATABASE')


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


app_config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
