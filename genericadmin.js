/*  genericadmin - No jQuery required
      Weston Nielson - wnielson@gmail.com
      
      NOTE: This code is OLDER than the one in
      trunk, but doesn't require jQuery.  I'd
      like to drop the need for jQuery, so I'll
      be upating this code...
--------------------------------------------------*/

var MAX_STRING_LENGTH = 0;  // Set to 0 for no limit

var ELEMENT_ARRAY = new Array();	// array to hold all of our important 'elements': ['id', 'content_type_repr', 'object_id_repr']
var OBJ_LOOKUP_ARRAY = new Array();  // holds fields waiting for lookup

function str_length(str, len){  // Simple function to limit the length of object display (appends '...' if needed)
    if (len == 0) { return str; }
    rstr = '';
    for (var i = 0; i < str.length; i++) { if(i <= len) { rstr += str[i]; }}
    if (rstr != str) { rstr += '...'; }
    return rstr;
}

function do_bulk_obj_lookup(){
    //  instead of firing off a bunch of lookup calls, this compiles all the elements in 'OBJ_LOOKUP_ARRAY' into a single argument
    //  which is then passed off a single call to the server
    compiled_objs = '(';  // build something like: ((2,3),(4,3),(5,3),) <- trailing ',' is VITAL!!!!
    for (var i = 0; i < OBJ_LOOKUP_ARRAY.length; i++){ compiled_objs += "(" + OBJ_LOOKUP_ARRAY[i][0] + "," + OBJ_LOOKUP_ARRAY[i][1] + "),"; };
    compiled_objs += ")";
    generic_make_request("lookup=" + compiled_objs);
}

function do_obj_lookup(object_el){
        object_display_id = 'obj-display_' + object_el.id;  // Id of object display '<strong>...</strong>'
        object_id_arr = object_el.id.split('.');
        if (object_id_arr.length > 2){ content_type_id = object_id_arr[0] + '.' + object_id_arr[1] + '.content_type'; }
        else { content_type_id = object_id_arr[0] + '.content_type'; }
        content_type_el = document.getElementById(content_type_id);
    if(object_el.value && content_type_el.value){
        document.getElementById(object_display_id).innerHTML = "loading...";
        OBJ_LOOKUP_ARRAY.push([content_type_el.value, object_el.value, object_display_id]);
        generic_make_request("lookup=((" + content_type_el.value + "," + object_el.value + "), )");
    }
    else { document.getElementById(object_display_id).innerHTML = ""; }
}

function generic_make_request(url) {
    var http_request = xmlhttp;  // xmlhttp is defined in core.js
    url = '../../../' + 'obj_lookup_xml?' + url;
    http_request.onreadystatechange = function() { generic_process_request(http_request); };
    http_request.open('GET', url, true );
    http_request.send(null);
}

function generic_process_request(http_request) {
    if (http_request.readyState == 4) {
        if (http_request.status == 200) {
            response = http_request.responseXML.documentElement;  // Process XML
            objects = response.getElementsByTagName('object');
            for(var i = 0; i < objects.length; i++){
                el = document.getElementById(OBJ_LOOKUP_ARRAY[i][2]);
                object_text = response.getElementsByTagName('object_text')[i].firstChild.data;
                object_text = str_length(object_text, MAX_STRING_LENGTH);
                el.innerHTML = object_text;
            }
            OBJ_LOOKUP_ARRAY = [];  // Done!
        }  // fail silently
    }
}

function generic_init() {
	select_el_arr = document.getElementsByTagName('select');
	content_type_el_arr = new Array();
	for (var i = 0; i < select_el_arr.length; i++){
		if (select_el_arr[i].id.indexOf('content_type') > -1) {	// grab all 'select' elements which are 'content_type's
			content_type_args = select_el_arr[i].id.split('.');	// could be id_modelname.x.content_type or id_modelname.content_type
			
			if (content_type_args.length == 3) {
				content_type_id = content_type_args[1];
				content_type_repr = select_el_arr[i].id;
				object_id_repr = content_type_args[0] + '.' + content_type_args[1] + '.object_id';	
			} else {
				content_type_id = '';
				content_type_repr = select_el_arr[i].id;
				object_id_repr = 'id_object_id';
			}
			temp_arr = new Array(content_type_id, content_type_repr, object_id_repr);
			ELEMENT_ARRAY.push(temp_arr);
		}
	}
	
	for (var i = 0; i < ELEMENT_ARRAY.length; i++) {
		// Add link manangement 'onchange'			
		arr_index = i;
		content_type_el = document.getElementById(ELEMENT_ARRAY[arr_index][1]);
		content_type_el.setAttribute('onchange', 'javascript:generic_change(' + arr_index + ');');
		generic_init_links(arr_index);
	}
	
	// fire off our object lookup calls now
	if (ELEMENT_ARRAY.length > 0) { do_bulk_obj_lookup(); }
};

function generic_init_links(arr_index) {
	content_type_el = document.getElementById(ELEMENT_ARRAY[arr_index][1]);
	object_id_el = document.getElementById(ELEMENT_ARRAY[arr_index][2]);
	
	// I don't like this.  I want to make 'showRelatedObjectLookupPopup' call 'do_obj_lookup'.
	object_id_el.setAttribute('onfocus', 'javascript:do_obj_lookup(this);');
    object_id_el.setAttribute('onchange', 'javascript:do_obj_lookup(this);');
	
    parent_el = object_id_el.parentNode;
    if (content_type_el.value != '') {
    	for (var i = 0; i < model_url_arr.length; i++)
    		if (model_url_arr[i][0] == content_type_el.value)
    			related_lookup_url = '../../../' + model_url_arr[i][1];
    	parent_el.innerHTML += '<a href="' + related_lookup_url + '" class="related-lookup" id="lookup_' + object_id_el.id + '" onclick="return showRelatedObjectLookupPopup(this);"><img src="/admin_media/img/admin/selector-search.gif" width="16" height="16" alt="Lookup"></a><strong style="width: 100px;" class="float-right" id="obj-display_' + object_id_el.id + '"></strong>';
    	
    	//  build array for obj_lookup
    	c_id = content_type_el.value;
    	o_id = object_id_el.value;
    	obj_display_id = "obj-display_" + object_id_el.id;
    	OBJ_LOOKUP_ARRAY.push([c_id, o_id, obj_display_id]);
    }
};

function generic_link(arr_index) {
	content_type_el = document.getElementById(ELEMENT_ARRAY[arr_index][1]);
	object_id_el = document.getElementById(ELEMENT_ARRAY[arr_index][2]);
	
    link = document.getElementById('lookup_' + object_id_el.id);	// Check for the existence of a related-lookup link already
    if (!link){
        parent_el = object_id_el.parentNode;
        for (var i = 0; i < model_url_arr.length; i++) {
        	if (model_url_arr[i][0] == content_type_el.value)
        		related_lookup_url = '../../../' + model_url_arr[i][1];
        }
        parent_el.innerHTML += '<a href="' + related_lookup_url + '" class="related-lookup" id="lookup_' + object_id_el.id + '" onclick="return showRelatedObjectLookupPopup(this);" onchange="javascript:do_obj_lookup(this);"><img src="/admin_media/img/admin/selector-search.gif" width="16" height="16" alt="Lookup"></a><strong style="width: 100px;" class="float-right" id="obj-display_' + object_id_el.id + '"></strong>';
    } else {
        // Link already exists, change it's href
        match = false;
        for (var i = 0; i < model_url_arr.length; i++) {
        	if (model_url_arr[i][0] == content_type_el.value) {
        		related_lookup_url = '../../../' + model_url_arr[i][1];
        		link.href = related_lookup_url;
        		match = true;
        	}
        }
        if (!match)
        	link.parentNode.removeChild(link);
    }
    return true;
};
    
function generic_change(arr_index) {
    el1 = document.getElementById(ELEMENT_ARRAY[arr_index][1]);
    el2 = document.getElementById(ELEMENT_ARRAY[arr_index][2]);
    generic_link(arr_index, el1, el2);
    return true;
};

window.addEventListener('load', generic_init, false);