from flask import Flask, render_template, request, jsonify, redirect

import json

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='(%',
        block_end_string='%)',
        variable_start_string='((',
        variable_end_string='))',
        comment_start_string='(#',
        comment_end_string='#)',
    ))

app = CustomFlask(__name__)

# Routes
@app.route('/')
def index():
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    return render_template('index.html')

@app.route('/configure')
def configuration_page():
    return render_template('configure.html')

@app.route('/procedures')
def procedure_page():
    return render_template('procedures.html')


@app.route('/configurations', methods=['POST', 'GET'])
def manage_configurations():
    if request.method == 'POST':
        print("POST HAHA")

    if request.method == 'GET':
        # Get configurations from json file and send
        with open('2ber/data/configurations.json') as fi:
            return jsonify(json.load(fi))
    return "False"


if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0')
