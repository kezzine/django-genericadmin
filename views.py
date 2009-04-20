from django.shortcuts import render_to_response
from django.http import Http404, HttpResponse
from django.template import Context, Template

from django.contrib.contenttypes.models import ContentType

JSON_TEMPLATE = '''[{% for obj in objects %}{contentTypeId:'{{ obj.content_type_id }}',contentTypeText:'{{ obj.content_type_text }}',objectId:'{{ obj.object_id }}',objectText:'{{ obj.object_text }}'}{% if not forloop.last %},{% endif %}{% endfor %}]'''

def get_obj(content_type_id, object_id):
    content_type = ContentType.objects.get(pk=content_type_id)
    try:
        obj = content_type.get_object_for_this_type(pk=object_id)
    except:
        obj = None
    content_type_text = unicode(content_type)

    if obj:
        object_text = unicode(obj)
    else:
        object_text = ""
    return {
        'content_type_text': content_type_text,
        'content_type_id': content_type_id,
        'object_text': object_text,
        'object_id': object_id
    }

def generic_lookup(request):
    # TODO: there isn't any error checking...
    if request.method == 'GET':
        objects = []
        if request.has_key('content_type') and request.has_key('object_id'):
            obj = get_obj(request['content_type'], request['object_id'])
            objects = (obj, )
        elif request.has_key('lookup'):
            objs = eval(request['lookup'])
            for obj in objs:
                objects.append(get_obj(obj[0], obj[1]))
        if objects:
            t = Template(JSON_TEMPLATE)
            c = Context({'objects': objects})
            return HttpResponse(t.render(c), mimetype='text/plaintext')