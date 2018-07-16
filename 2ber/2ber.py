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
    # Get configurations from json file
    with open('2ber/data/configurations.json') as fi:
        configs = json.load(fi)

    # If you're saving a config, add it to the configs and write it to the file
    if request.method == 'POST':
        new_config = request.get_json()['configuration']
        configs[:] = [d for d in configs if d.get('name') != new_config['name']]
        configs.append(new_config)
        with open('2ber/data/configurations.json', 'w') as fi:
            json.dump(configs, fi, indent=2)


    # Return the master list no matter what
    return jsonify(configs)


if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0')
