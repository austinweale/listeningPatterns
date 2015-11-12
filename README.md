# spotify-template
This template is an optional starting point for a challenge for the following [course](http://faculty.washington.edu/mikefree/info343/) at the University of Washington.  The instructions are described [here](http://faculty.washington.edu/mikefree/info343/#/challenges/spotify).

What is the purpose of your project (i.e., why would someone use this app)?
	Last.fm Feature: Last.fm logs data about what music their users listen to, and their users can look back at their music history/top bands etc. A feature that is not available on last.fm is to see where your top bands are all from. I figure people would be interested in seeing this data. So I created the app to map any user's top 10 bands to where they are from. 

	Spotify Feature: You can use this feature to see trends in different keywords used in song names between locations. It is interesting data to see, but unfortunately quite a few of the locations cannot be found on the musicBrainz database and are listed as unknown. 


What is the URL of this project on your student web-server?
students.washington.edu/alw34/info343/listeningpatterns

Did you receive help from any other sources (classmates, etc.)? If so, please list who.
None

Approximately how many hours did it take you to complete this challenge?
10 hours

Did you encounter any problems in this challenge we should warn students about in the future? How can we make the challenge better?
It took me a few days to realize how to fix the error that my scope arrays were not updating when I changed them. It turned out that the answer was to call "$scope.$apply()" but it was really hard to find this answer by searching google. 
The Spotify web API documentation is really hard to understand. Especially the parts that involve authentification for certain data. It would be helpful to devote some class time to understanding how to use the API. 
The last.fm API is super easy to use and has really cool data. It could be cool to suggest this as an option in future classes. 