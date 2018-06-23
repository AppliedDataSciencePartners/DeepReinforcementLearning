### v3.0.0

* New API interface: `tomlify.toToml(obj, opts)`, `tomlify.toValue(obj, opts)`.
  `tomlify` is no longer a function. (incompatible changes)
* New option `sort` to specify a compare function for sorting table keys.

### v2.1.1

* New API `tomlify.toToml()`.
* Check for circular data structure in `tomlify.toValue()`.

### v2.0.0

Breaking change:

* In any case, do not indent array elements when `space` is empty.
* Now `tomlify.toValue` always make every inline-table fit into one line.
