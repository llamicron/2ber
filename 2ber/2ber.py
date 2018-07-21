import time
import json

from flask import Flask, render_template, request, jsonify, redirect

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='{%',
        block_end_string='%}',
        variable_start_string='((',
        variable_end_string='))',
        comment_start_string='(#',
        comment_end_string='#)',
    ))

app = CustomFlask(__name__)

# Pages
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



# Resources
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

@app.route('/thermo-temps', methods=['POST'])
def update_thermo_data():
    from random import randint
    controller_adr = request.get_json()['controller_address']
    adr = request.get_json()['address']
    # Get real temp
    temps = {
        'new_pv': {
            'x': round(time.time()),
            'y': randint(50, 200)
        },
        'new_sv': {
            'x': round(time.time()),
            'y': randint(50, 200)
        }
    }

    return jsonify(temps)

@app.route('/update')
def send_new_state():
    config = request.get_json()['config']
    # Update state
    return jsonify(config)

if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0')
