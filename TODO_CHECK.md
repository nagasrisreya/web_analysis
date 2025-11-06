# TODO: Check if all responsibilities from the 4 members are implemented and working on the website

## Member 1: Data Collection & Ingestion Engineer
- [x] Implement tracking scripts and event collection on websites/apps (tracker.js)
- [x] Set up JavaScript tracking library or integrate existing solutions (custom JS library)
- [x] Design event schema and data models for tracking (type, details, page, timestamp, referrer)
- [ ] Configure message queues (Kafka/Kinesis/Pub/Sub) for data ingestion (not implemented)
- [x] Build data validation at entry points (basic validation in routes)
- [ ] Handle API integrations for third-party data sources (not implemented)
- [x] Implement error handling and retry mechanisms (try-catch in tracker and routes)
- [ ] Monitor ingestion rates and data quality at source (not implemented)

## Member 2: Data Processing & ETL Engineer
- [ ] Build stream processing pipelines for real-time data transformation (not implemented)
- [ ] Develop batch processing jobs for historical data (not implemented)
- [x] Implement data cleaning, deduplication, and validation logic (basic in routes)
- [ ] Create data enrichment processes (geolocation, user agent parsing, session tracking) (not implemented)
- [ ] Design and implement ETL workflows (Apache Spark, Airflow) (not implemented)
- [ ] Handle data partitioning and optimization strategies (not implemented)
- [ ] Set up data quality monitoring and alerting (not implemented)
- [ ] Manage pipeline orchestration and scheduling (not implemented)

## Member 3: Data Storage & Infrastructure Engineer
- [ ] Design and implement data warehouse schema (star/snowflake) (not implemented)
- [ ] Set up data lake infrastructure (S3, HDFS, etc.) (not implemented)
- [x] Configure databases (SQLite)
- [ ] Implement data retention and archival policies (not implemented)
- [ ] Optimize query performance and indexing strategies (not implemented)
- [ ] Set up backup and disaster recovery (not implemented)
- [ ] Manage cloud infrastructure and cost optimization (not implemented)
- [ ] Handle security, access control, and encryption (not implemented)
- [ ] Monitor system performance and scaling (not implemented)

## Member 4: Analytics & Visualization Engineer
- [x] Build dashboards and visualization layers (custom React dashboard)
- [ ] Create SQL queries and analytical models (direct DB queries, no SQL)
- [x] Implement key metrics and KPIs (total visits, most visited, avg time)
- [ ] Design user segmentation and funnel analysis (not implemented)
- [ ] Develop automated reporting systems (not implemented)
- [x] Create APIs for data access (analytics API)
- [ ] Build alerting for anomaly detection (not implemented)
- [ ] Document analytics specifications and user guides (not implemented)
- [ ] Gather requirements from stakeholders (not implemented)

## Testing the current implementation
- [ ] Test the exclusion of analytics page from tracking (as per existing TODO.md) - partially done, need to complete exclusion in /analytics endpoint
- [x] Verify frontend and backend are running without errors (running on localhost:5174 and 5001)
- [ ] Check if basic tracking (page views, clicks, time on page) works
- [ ] Check if analytics dashboard displays data correctly
- [ ] Verify data is stored in SQLite and retrieved properly
