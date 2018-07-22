import time
import json

from flask import Flask, render_template, request, jsonify, redirect

from pprint import pprint

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
with open('2ber/data/configurations.json') as fi:
        app.configs = json.load(fi)

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
    # If you're saving a config, add it to the configs and write it to the file
    if request.method == 'POST':
        new_config = request.get_json()['configuration']
        app.configs[:] = [d for d in app.configs if d.get('id') != new_config['id']]
        app.configs.append(new_config)
        with open('2ber/data/configurations.json', 'w') as fi:
            json.dump(app.configs, fi, indent=2)


    # Return the master list no matter what
    return jsonify(app.configs)

@app.route('/thermo-temps', methods=['POST'])
def update_chart_data():
    from random import randint
    thermo = request.get_json()['thermo']
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

@app.route('/update/config/<id>', methods=['GET', 'POST'])
def send_new_state(id):
    if request.method == 'GET':
        # Get default config from list and update to actual values
        config = [c for c in app.configs if c.get('id') == id][0]
        # Update state
        config['lastRetrieved'] = round(time.time())
        return jsonify(config)

    if request.method == 'POST':
        config = request.get_json()['config']
        config['lastPosted'] = round(time.time())
        for dev_type, devs in config['devices'].items():
            for dev in devs:
                try:
                    state = 0
                    if dev['newState']:
                        state = 1
                    dev['state'] = state
                except KeyError:
                    pass

        # Temporary, because i don't have access to hardware at the moment
        app.configs = [config]
        return jsonify(config)


if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0')
