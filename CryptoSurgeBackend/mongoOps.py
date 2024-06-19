import json
from pymongo import MongoClient
with open('./config/mongo.json') as config_file:
    config = json.load(config_file)
client = MongoClient('mongodb+srv://'+config['host']+'/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName='+config['cluster'],
                     tls=True,
                     tlsCertificateKeyFile=config['credentials'])
databasesNames = ['hub_fundamental_analysis', 'hub_on_chain_analysis', 'hub_technical_analysis', 'hub_trading_strategies', 'hub_blockchain_technology', 'hub_defi_decentralized_finance', 'hub_nft_non_fungible_tokens', 'hub_market_reports', 'hub_market_sentiment', 'hub_market_trends', 'hub_price_predictions', 'hub_risk_management', 'hub_regulations_and_compliance']
collectionsNames_hub_fundamental_analysis = ['comments_financial_statements', 'comments_industry_analysis', 'comments_trends', 'comments_valuation_models', 'feedbacks_financial_statements', 'feedbacks_industry_analysis', 'feedbacks_trends', 'feedbacks_valuation_models', 'posts_financial_statements', 'posts_industry_analysis', 'posts_trends', 'posts_valuation_models']
collectionsNames_hub_on_chain_analysis = ['comments_blockchain_metrics', 'comments_network_activity', 'comments_token_distribution', 'comments_transaction_volume', 'feedbacks_blockchain_metrics', 'feedbacks_network_activity', 'feedbacks_token_distribution', 'feedbacks_transaction_volume', 'posts_blockchain_metrics', 'posts_network_activity', 'posts_token_distribution', 'posts_transaction_volume']
collectionsNames_hub_technical_analysis = ['comments_analysis_tools', 'comments_chart_patterns', 'comments_technical_indicators', 'comments_trading_signals', 'feedbacks_analysis_tools', 'feedbacks_chart_patterns', 'feedbacks_technical_indicators', 'feedbacks_trading_signals', 'posts_analysis_tools', 'posts_chart_patterns', 'posts_technical_indicators', 'posts_trading_signals']
collectionsNames_hub_trading_strategies = ['comments_day_trading', 'comments_hodling', 'comments_strategy_development', 'comments_swing_trading', 'feedbacks_day_trading', 'feedbacks_hodling', 'feedbacks_strategy_development', 'feedbacks_swing_trading', 'posts_day_trading', 'posts_hodling', 'posts_strategy_development', 'posts_swing_trading']
collectionsNames_hub_blockchain_technology = ['comments_consensus_mechanisms', 'comments_scalability', 'comments_smart_contracts', 'comments_use_cases', 'feedbacks_consensus_mechanisms', 'feedbacks_scalability', 'feedbacks_smart_contracts', 'feedbacks_use_cases', 'posts_consensus_mechanisms', 'posts_scalability', 'posts_smart_contracts', 'posts_use_cases']
collectionsNames_hub_defi_decentralized_finance = ['comments_decentralized_exchanges', 'comments_challenges_and_opportunities', 'comments_lending_platforms', 'comments_protocols', 'feedbacks_decentralized_exchanges', 'feedbacks_challenges_and_opportunities', 'feedbacks_lending_platforms', 'feedbacks_protocols', 'posts_decentralized_exchanges', 'posts_challenges_and_opportunities', 'posts_lending_platforms', 'posts_protocols']
collectionsNames_hub_nft_non_fungible_tokens = ['comments_art', 'comments_collectibles', 'comments_gaming', 'feedbacks_art', 'feedbacks_collectibles', 'feedbacks_gaming', 'posts_art', 'posts_collectibles', 'posts_gaming']
collectionsNames_hub_market_reports = ['comments_analysis_and_insights', 'comments_daily_reports', 'comments_monthly_reports', 'comments_weekly_reports', 'feedbacks_analysis_and_insights', 'feedbacks_daily_reports', 'feedbacks_monthly_reports', 'feedbacks_weekly_reports', 'posts_analysis_and_insights', 'posts_daily_reports', 'posts_monthly_reports', 'posts_weekly_reports']
collectionsNames_hub_market_sentiment = ['comments_bullish_sentiment', 'comments_bearish_sentiment', 'comments_neutral_sentiment', 'comments_sentiment_analysis', 'feedbacks_bullish_sentiment', 'feedbacks_bearish_sentiment', 'feedbacks_neutral_sentiment', 'feedbacks_sentiment_analysis', 'posts_bullish_sentiment', 'posts_bearish_sentiment', 'posts_neutral_sentiment', 'posts_sentiment_analysis']
collectionsNames_hub_market_trends = ['comments_bull_markets', 'comments_bear_markets', 'comments_sideways_markets', 'comments_trend_analysis', 'feedbacks_bull_markets', 'feedbacks_bear_markets', 'feedbacks_sideways_markets', 'feedbacks_trend_analysis', 'posts_bull_markets', 'posts_bear_markets', 'posts_sideways_markets', 'posts_trend_analysis']
collectionsNames_hub_price_predictions = ['comments_forecasting_models', 'comments_long_term_predictions', 'comments_short_term_predictions', 'feedbacks_forecasting_models', 'feedbacks_long_term_predictions', 'feedbacks_short_term_predictions', 'posts_forecasting_models', 'posts_long_term_predictions', 'posts_short_term_predictions']
collectionsNames_hub_risk_management = ['comments_portfolio_diversification', 'comments_stop_loss_strategies', 'comments_risk_assessment', 'comments_risk_reward_ratio', 'feedbacks_portfolio_diversification', 'feedbacks_stop_loss_strategies', 'feedbacks_risk_assessment', 'feedbacks_risk_reward_ratio', 'posts_portfolio_diversification', 'posts_stop_loss_strategies', 'posts_risk_assessment', 'posts_risk_reward_ratio']
collectionsNames_hub_regulations_and_compliance = ['comments_compliance_issues', 'feedbacks_compliance_issues', 'posts_compliance_issues', 'comments_future_trends', 'feedbacks_future_trends', 'posts_future_trends', 'comments_global_frameworks', 'feedbacks_global_frameworks', 'posts_global_frameworks', 'comments_regulatory_impact', 'feedbacks_regulatory_impact', 'posts_regulatory_impact']
def printDatabasesAndCollections():
    try:
        databases = client.list_database_names()
        for db_name in databases:
            print(f"{db_name}")
            database = client[db_name]
            collections = database.list_collection_names()
            for collection_name in collections:
                print(f"\t{collection_name}")
    except Exception as e:
        print(f"An error occurred: {e}")
def createDatabases(db_names):
    try:
        for db_name in db_names:
            database = client[db_name]
            collection_name = 'initial_collection'
            database.create_collection(collection_name)
            print(f"Database '{db_name}' with collection '{collection_name}' created.")
    except Exception as e:
        print(f"An error occurred: {e}")
def createCollections(database_name, collection_names):
    try:
        database = client[database_name]
        for collection_name in collection_names:
            database.create_collection(collection_name)
            print(f"Collection '{collection_name}' created in database '{database_name}'.")
    except Exception as e:
        print(f"An error occurred: {e}")
def deleteDatabases(db_names):
    try:
        for db_name in db_names:
            # Drop the database
            client.drop_database(db_name)
            print(f"Database '{db_name}' deleted.")
    except Exception as e:
        print(f"An error occurred: {e}")
def deleteCollections(database_name, collection_names):
    try:
        database = client[database_name]
        for collection_name in collection_names:
            database.drop_collection(collection_name)
            print(f"Collection '{collection_name}' deleted from database '{database_name}'.")
    except Exception as e:
        print(f"An error occurred: {e}")
def deleteAllDatabasesExcept(exceptions):
    try:
        databases = client.list_database_names()
        for db_name in databases:
            if db_name not in exceptions:
                client.drop_database(db_name)
                print(f"Database '{db_name}' deleted.")
    except Exception as e:
        print(f"An error occurred: {e}")
def createCryptoSurgeDatabases():
    createDatabases(databasesNames)
def createCryptoSurgeCollections():
    createCollections('hub_fundamental_analysis',collectionsNames_hub_fundamental_analysis) 
    createCollections('hub_on_chain_analysis',collectionsNames_hub_on_chain_analysis) 
    createCollections('hub_technical_analysis',collectionsNames_hub_technical_analysis) 
    createCollections('hub_trading_strategies',collectionsNames_hub_trading_strategies) 
    createCollections('hub_blockchain_technology',collectionsNames_hub_blockchain_technology) 
    createCollections('hub_defi_decentralized_finance',collectionsNames_hub_defi_decentralized_finance) 
    createCollections('hub_nft_non_fungible_tokens',collectionsNames_hub_nft_non_fungible_tokens) 
    createCollections('hub_market_reports',collectionsNames_hub_market_reports) 
    createCollections('hub_market_sentiment',collectionsNames_hub_market_sentiment) 
    createCollections('hub_market_trends',collectionsNames_hub_market_trends) 
    createCollections('hub_price_predictions',collectionsNames_hub_price_predictions) 
    createCollections('hub_risk_management',collectionsNames_hub_risk_management) 
    createCollections('hub_regulations_and_compliance',collectionsNames_hub_regulations_and_compliance)
    deleteCollections('hub_fundamental_analysis',['initial_collection'])
    deleteCollections('hub_on_chain_analysis',['initial_collection'])
    deleteCollections('hub_technical_analysis',['initial_collection'])
    deleteCollections('hub_trading_strategies',['initial_collection'])
    deleteCollections('hub_blockchain_technology',['initial_collection'])
    deleteCollections('hub_defi_decentralized_finance',['initial_collection'])
    deleteCollections('hub_nft_non_fungible_tokens',['initial_collection'])
    deleteCollections('hub_market_reports',['initial_collection'])
    deleteCollections('hub_market_sentiment',['initial_collection'])
    deleteCollections('hub_market_trends',['initial_collection'])
    deleteCollections('hub_price_predictions',['initial_collection'])
    deleteCollections('hub_risk_management',['initial_collection'])
    deleteCollections('hub_regulations_and_compliance',['initial_collection'])
def createCryptoSurgeMongodbCluster():
    createCryptoSurgeDatabases()
    createCryptoSurgeCollections()
def deleteAllDatabasesCarefully():
    doNotDeleteTheseDatabases = ['DatabaseCryptoSurge', 'admin', 'local']
    deleteAllDatabasesExcept(doNotDeleteTheseDatabases)
if __name__ == "__main__":
    createCryptoSurgeMongodbCluster()
    print('\t\t\t\t ~~~ Done creating CryptoSurge mongodb cluster !\n\n')
    printDatabasesAndCollections()
    client.close()