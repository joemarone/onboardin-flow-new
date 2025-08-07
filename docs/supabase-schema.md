📋 customers
Column Name	Type
id	uuid
created_at	timestamp with time zone
updated_at	timestamp with time zone
advisor_id	uuid
support_id	uuid
start_date	date
transfer	boolean
step	USER-DEFINED
step1_converted	boolean
step1_using_esa	boolean
step2_consent	boolean
step2_payment	boolean
completed_at	timestamp with time zone
parent_first_name	text
parent_last_name	text
parent_email	text
student_first_name	text
student_last_name	text

📨 email_logs
Column Name	Type
id	uuid
customer_id	uuid
template	USER-DEFINED
sent_by	uuid
sent_at	timestamp with time zone
to_email	text

📄 email_templates
Column Name	Type
id	uuid
key	USER-DEFINED
updated_by	uuid
updated_at	timestamp with time zone
subject	text
body	text

🧠 notes
Column Name	Type
id	uuid
customer_id	uuid
author_id	uuid
created_at	timestamp with time zone
body	text

👥 staff
Column Name	Type
id	uuid
name	text
email	text
role	USER-DEFINED
active	boolean
created_at	timestamp with time zone