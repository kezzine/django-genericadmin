# Requirements #

The trunk version requires some of the newer features of Django.  You will need **at least** [revision 9739](https://code.google.com/p/django-genericadmin/source/detail?r=9739).

# Installation #

The trunk version of genericadmin is also easier to install than the previous version (0.1 in tags).  To install it, simply add `genericadmin` to your `INSTALLED_APPS`.  If you've defined a custom `base_site.html` within your templates directory then you will need to add the following to it:

```
{% block extrahead %}
  {{ block.super }}
  <script type="text/javascript">{% include "admin/genericadmin/genericadmin.js" %}</script>
{% endblock %}
```


That is it.  There is no longer  a need to move `genericadmin.js` into your media root.  Also, jQuery is required, but will be included automatically using Google's CDN **only if** you haven't already included jQuery.