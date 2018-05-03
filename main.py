import json
from flask import Flask, jsonify, request, url_for, abort, Response,render_template
from flask_sqlalchemy import SQLAlchemy

api = Flask(__name__)
api.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(api)
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(20), unique=True)
    completed = db.Column(db.Boolean)

    def __init__(self,value,completed):
        self.value = value
        self.completed = completed

    def __repr__(self):
        return '<Todo ' + str(self.id) + ':' + self.value + '>'
def createTodo(value):
    create_todo = Todo(value,False)
    db.session.add(create_todo) 
    try: 
        db.session.commit()
        return create_todo
    except:  
        print("this todo is already registered todo.")
        return {"error": "this todo is already registered todo."}

def deleteTodo(todo_id):
    try:
        todo = db.session.query(Todo).filter_by(id=todo_id).first()
        db.session.delete(todo)
        db.session.commit()
        return todo
    except:
        db.session.rollback()
        print("failed to delete this todo.")
        return {"error": "failed to delete this todo."}

def updateTodo(todo_id,update_thing):
    try:
        todo = db.session.query(Todo).filter_by(id=todo_id).first()
        if isinstance(update_thing,str):
            todo.value = update_thing
        else:
            todo.completed = update_thing
        db.session.add(todo)
        db.session.commit()
        return todo
    except:
        db.session.rollback()
        print("failed to update this todo.")
        return {"error": "failed to update this todo."}

def getTodo():
    return Todo.query.all()

# 一覧表示
try:
    print(Todo.query.all())
except:
    print("中身がない")

@api.route('/')
def index():
    return render_template("index.html")

@api.route('/api')
def api_index():
            return jsonify({'message': "This is the Todo api by Anharu."})

@api.route('/api/todos', methods=['GET'])
def todos():
    todos = []
    for todo in getTodo():
        todo = {"id": todo.id, "value": todo.value,"completed": todo.completed}
        todos.append(todo)

    return jsonify({"todos":todos})

@api.route('/api/todos', methods=['POST'])
def create():
    value = request.form["value"]
    create_todo = createTodo(value)
    if isinstance(create_todo,dict):
        return jsonify({"error": create_todo["error"]})
    else:
        return jsonify({"created_todo": create_todo.value})

@api.route('/api/todos/<int:todo_id>',methods=['PUT'])
def update_completed(todo_id):
    if request.form["completed"] == "true":
        completed = True
    else:
        completed = False
    print(completed)
    update_todo = updateTodo(todo_id,completed)
    if isinstance(update_todo,dict):
        return jsonify({"error": update_todo["error"]})
    else:
        return jsonify({"updated_todo": update_todo.value})

@api.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete(todo_id):
    delete_todo = deleteTodo(todo_id)
    if isinstance(delete_todo,dict):
        return jsonify({"error": delete_todo["error"]})
    else:
        return jsonify({"deleted_todo": delete_todo.value})

@api.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'})
if __name__ == '__main__':
    api.run(host='0.0.0.0', port=3333)
