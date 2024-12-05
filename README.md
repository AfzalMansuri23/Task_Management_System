Task Management System
A web-based application for managing task records, including adding, updating, and soft-deleting records. The app provides a clean interface for tracking financial transactions with filtering, searching, and status management features.

Features
Add Task Records: Users can add new financial records with title, description, date, and status.
Update Records: Edit existing records' details.
Record History: View all records, including soft-deleted ones.
Search and Filter: Search records by title or description and filter by status.
Soft Delete: Remove records without permanently deleting them.
Tech Stack
Backend: Python, Flask
Database: SQLite
Frontend: HTML, CSS, JavaScript
Dependencies: Flask, Flask-SQLAlchemy
Installation
Prerequisites
Ensure you have the following installed:

Python 3.8+
pip (Python package manager)
Setup
Clone the repository:

bash
Copy code
git clone https://github.com/AfzalMansuri23/Task_Management_System
cd finance
Create a virtual environment:

bash
Copy code
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Initialize the database:

bash
Copy code
python app1.py
Usage
Running the App
Start the server:
bash
Copy code
python app1.py
Open your browser and navigate to http://127.0.0.1:5000.
Application Routes
Pages
Home (/): View all financial records.
Add Record (/add): Form to add a new record.
Update Record (/update): Page for updating records.
History (/history): View all records, including soft-deleted ones.
API Endpoints
Get Records:

GET /finance
Parameters:
search: Search term for title or description.
status: Filter by record status.
date: Filter by date range (today, this_week, this_month).
Add Record:

POST /finance
Body:
json
Copy code
{
  "title": "Example Title",
  "description": "Optional description",
  "date": "YYYY-MM-DD",
  "status": "Pending"
}
Update Record:

PUT /finance/<id>
Body: Fields to update.
Toggle Record Status:

POST /finance/toggle-status/<id>
Body:
json
Copy code
{
  "status": "New Status"
}
Soft Delete Record:

POST /finance/delete/<id>
File Structure
plaintext
Copy code
.
├── app1.py              # Main application code
├── templates/           # HTML templates
│   ├── add_record.html
│   ├── records.html
│   ├── update_record.html
│   ├── history.html
├── static/              # Static assets
│   └── css/
│       └── style.css    # Styles for the app
├── requirements.txt     # Project dependencies
├── README.md            # Project documentation
Contributing
Fork the repository.
Create a feature branch:
bash
Copy code
git checkout -b feature-name
Commit changes and push to your fork.
Create a pull request.
License
This project is licensed under the MIT License. See LICENSE for details.

Contact
For questions or feedback, feel free to reach out:

Email: afzalmansuri233.jobs@gmail.com
GitHub: AfzalMansuri23
