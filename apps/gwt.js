function copy_exported_to_clipboard() {
  const textarea = document.createElement('textarea')
  var exported_area = document.getElementById("exported")
  let text = exported_area.value
  textarea.textContent = text
  let copyEl = document.body
  copyEl.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand('copy')
    exported_area.value = "copied"
  } catch (e) {
    console.warn(e)
  } finally {
    copyEl.removeChild(textarea)
  }
}

function update_default_values() {
  var foresight_data = get_foresight_data(document.getElementById("unofficial_variant").checked,
                                          Number(document.getElementById("num_players").value))
  set_foresight_data(foresight_data)
}

function get_hazard_default() {
  return {
    g4: 2,
    g3: 1,
    g2: 1,
    b3: 1,
    b2: 1
  }
}

function get_outlaw_default() {
  return {
    g1: 9,
    g3: 2,
    o1: 8,
    o3: 3
  }
}

function get_worker_default() {
  return {
    c2: 11,
    c3: 7,
    b2: 11,
    b3: 7,
    e2: 11,
    e3: 7
  }
}

function get_any(key, types) {
  var data = {}
  var parent_elem = document.querySelector('#' + key)
  for (t in types) {
    var elem = parent_elem.querySelector('.' + types[t])
    data[types[t]] = Number(elem.value)
  }
  return data
}

function get_hazard(key) {
  const types = ["g4", "g3", "g2", "b3", "b2"]
  return get_any(key, types)
}

function get_outlaw(key) {
  const types = ["g1", "g3", "o1", "o3"]
  return get_any(key, types)
}

function get_worker(key) {
  const types = ["c2", "c3", "b2", "b3", "e2", "e3"]
  return get_any(key, types)
}

function set_any(key, types, data) {
  var parent_elem = document.querySelector('#' + key)
  for (t in types) {
    var elem = parent_elem.querySelector('.' + types[t])
    elem.value = Number(data[key][types[t]])
  }
}

function set_hazard(key, data) {
  const types = ["g4", "g3", "g2", "b3", "b2"]
  set_any(key, types, data)
}

function set_outlaw(key, data) {
  const types = ["g1", "g3", "o1", "o3"]
  set_any(key, types, data)
}

function set_worker(key, data) {
  const types = ["c2", "c3", "b2", "b3", "e2", "e3"]
  set_any(key, types, data)
}

function set_any_from_data(key, types, arr) {
  var data = {}
  for (i in types) {
    data[types[i]] = arr[i]
  }
  var res = {}
  res[key] = data
  return res
}

function set_hazard_from_arr(key, arr) {
  const types = ["g4", "g3", "g2", "b3", "b2"]
  data = set_any_from_data(key, types, arr)
  set_any(key, types, data)
}

function set_outlaw_from_arr(key, arr) {
  const types = ["g1", "g3", "o1", "o3"]
  data = set_any_from_data(key, types, arr)
  set_any(key, types, data)
}

function set_worker_from_arr(key, arr) {
  const types = ["c2", "c3", "b2", "b3", "e2", "e3"]
  data = set_any_from_data(key, types, arr)
  set_any(key, types, data)
}

function get_foresight_data(unofficial_variant, num_players) {
  var data = {}
  data.flood = get_hazard_default()
  data.drought = get_hazard_default()
  data.rockfall = get_hazard_default()
  data.outlaw = get_outlaw_default()
  data.worker = get_worker_default()

  if (unofficial_variant) {
    if (num_players == 2) {
      data.outlaw.o1 -= 3
      data.outlaw.g1 -= 3
      data.flood.g4 -= 1
      data.flood.g2 -= 1
      data.drought.g4 -= 1
      data.drought.g2 -= 1
      data.rockfall.g4 -= 1
      data.rockfall.g2 -= 1

      data.worker.c2 -= 5
      data.worker.b2 -= 5
      data.worker.e2 -= 5

      data.outlaw.o3 -= 1
      data.outlaw.g3 -= 1
      data.worker.c3 -= 3
      data.worker.b3 -= 3
      data.worker.e3 -= 3
    } else if (num_players == 3) {
      data.outlaw.o1 -= 1
      data.outlaw.g1 -= 2
      data.flood.g3 -= 1
      data.drought.g3 -= 1
      data.rockfall.g3 -= 1

      data.worker.c2 -= 3
      data.worker.b2 -= 3
      data.worker.e2 -= 3

      data.outlaw.o3 -= 1
      data.worker.c3 -= 1
      data.worker.b3 -= 1
      data.worker.e3 -= 1
    }
  }

  return data
}

function set_foresight_data(data) {
  set_hazard("flood", data)
  set_hazard("drought", data)
  set_hazard("rockfall", data)
  set_outlaw("outlaw", data)
  set_worker("worker", data)
}

function data_import() {
  var elem = document.getElementById("for_import")
  const data = elem.value.split(",")
  if (data.length != 25) {
    console.log("Error: problem with the length in data_import")
    return;
  }
  set_hazard_from_arr("flood", data.slice(0, 5))
  set_hazard_from_arr("drought", data.slice(5, 10))
  set_hazard_from_arr("rockfall", data.slice(10, 15))
  set_outlaw_from_arr("outlaw", data.slice(15, 19))
  set_worker_from_arr("worker", data.slice(19, 25))
}

function data_export() {
  var data = {}
  var serialized = []
  data.flood = get_hazard("flood")
  data.drought = get_hazard("drought")
  data.rockfall = get_hazard("rockfall")
  data.outlaw = get_outlaw("outlaw")
  data.worker = get_worker("worker")
  for (key in data) {
    for (attr in data[key]) {
      serialized.push(data[key][attr])
    }
  }
  var elem = document.getElementById("exported")
  elem.value = serialized
}

var foresight_data = get_foresight_data(document.getElementById("unofficial_variant").checked,
                                        Number(document.getElementById("num_players").value))
set_foresight_data(foresight_data)
