from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

app = Flask(__name__)

# Configure SQLite database for financial records
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Financial Record model
class FinanceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    date = db.Column(db.String(50), nullable=False)  # Store date as string in format YYYY-MM-DD
    status = db.Column(db.String(50), nullable=False, default="Pending")
    deleted = db.Column(db.Boolean, default=False)



# Initialize the database (only the first time)
with app.app_context():
    db.create_all()
    
#routes for pages
@app.route('/')
def home():
    records = FinanceRecord.query.filter_by(deleted=False).all()  # Only non-deleted records
    return render_template('records.html', records=records)


@app.route('/add')
def add_record_page():
    return render_template('add_record.html')


@app.route('/update')
def update_record_page():
    return render_template('update_record.html')


@app.route('/history')
def record_history():
    records = FinanceRecord.query.all()  # Include soft-deleted records
    return render_template('history.html', records=records)


# Endpoint to get financial records with search, status, and date filtering
@app.route('/finance', methods=['GET'])
def get_financial_records():
    search_term = request.args.get('search', '')
    status_filter = request.args.get('status', '')
    
    # Search and status filter logic
    records_query = FinanceRecord.query
    if search_term:
        records_query = records_query.filter(
            FinanceRecord.title.ilike(f"%{search_term}%") |
            FinanceRecord.description.ilike(f"%{search_term}%")
        )
    if status_filter:
        records_query = records_query.filter(FinanceRecord.status.ilike(f"%{status_filter}%"))


    # Fetch records that are not deleted
    records = records_query.filter_by(deleted=False).all()

    # Return a list of records as JSON
    records_list = [
        {"id": r.id, "title": r.title, "description": r.description, "date": r.date, "status": r.status}
        for r in records
    ]
    return jsonify(records_list)



# Endpoint to add a new financial record
@app.route('/finance', methods=['POST'])
def add_financial_record():
    try:
        data = request.json  # Parse JSON data
        print("Received data:", data)  # Debug: Log the received data

        # Validate required fields
        if not data.get('title') or not data.get('date') or not data.get('status'):
            return jsonify({"message": "Title, Date, and Status are required!"}), 400

        # Create a new record
        new_record = FinanceRecord(
            title=data['title'],
            description=data.get('description', ''),
            date=data['date'],
            status=data['status']
        )
        print("New Record:", new_record)  # Debug: Log the new record

        # Add to the database
        db.session.add(new_record)
        db.session.commit()
        return jsonify({"message": "Record added successfully!"}), 201
    except Exception as e:
        print("Error:", e)  # Debug: Log any errors
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

#  Endpoint to Update a existing finance record data
@app.route('/finance/<int:id>', methods=['PUT'])
def update_record(id):
    # Parse JSON data from the request
    data = request.json

    # Fetch the record by ID
    record = FinanceRecord.query.get(id)
    if not record:
        return jsonify({"message": "Record not found!"}), 404

    # Update fields only if they are provided
    record.title = data.get('title', record.title)
    record.description = data.get('description', record.description)
    record.date = data.get('date', record.date)
    record.status = data.get('status', record.status)

    # Commit changes to the database
    db.session.commit()

    return jsonify({"message": "Record updated successfully!"}), 200



@app.route('/finance/toggle-status/<int:id>', methods=['POST'])
def toggle_status(id):
    data = request.json
    new_status = data.get('status')

    if not new_status:
        return jsonify({"success": False, "message": "Status is required"}), 400

    record = FinanceRecord.query.get(id)
    if not record:
        return jsonify({"success": False, "message": "Record not found"}), 404

    # Update the status in the database
    record.status = new_status
    db.session.commit()

    # Return the updated status
    return jsonify({
        "success": True,
        "message": "Status updated successfully",
        "id": id,
        "new_status": record.status,
    })





@app.route('/finance/delete/<int:id>', methods=['POST'])
def soft_delete_record(id):
    # Fetch the record by ID
    record = FinanceRecord.query.get(id)
    if not record:
        return jsonify({"success": False, "message": "Record not found!"}), 404

    # Mark the record as deleted
    record.deleted = True
    db.session.commit()

    return jsonify({"success": True, "message": "Record soft-deleted successfully!", "id": id}), 200




if __name__ == '__main__':
    app.run(debug=True)
