Django's admin doesn't make it easy to work with generic relationships.  This project makes it so that generic relationship in the admin work very similarly to how a ForeignKey field does.

Some images may help to understand more clearly how this looks.

![http://django-genericadmin.googlecode.com/svn/wiki/GenericRelation.01.png](http://django-genericadmin.googlecode.com/svn/wiki/GenericRelation.01.png)

![http://django-genericadmin.googlecode.com/svn/wiki/GenericRelation.02.png](http://django-genericadmin.googlecode.com/svn/wiki/GenericRelation.02.png)

![http://django-genericadmin.googlecode.com/svn/wiki/GenericRelation.03.png](http://django-genericadmin.googlecode.com/svn/wiki/GenericRelation.03.png)


---


I also have a version of this code that doesn't require jQuery and simply piggy backs off the javascript that comes with a standard Django installation, but the code is a bit dusty.  I've added it into branches and will be updating it when I've got time.