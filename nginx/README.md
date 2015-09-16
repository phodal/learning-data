#Play Nginx with ES,Hadoop,Pig

##Setup 

1.Install Python Deps

    pip install -r requirements.txt
   
2.Hadoop & ElasticSearch
   
    brew install hadoop
    brew install pig 
    brew install elasticsearch
    
3.Install pig

     brew install pig
     
4.Install pig-elasticsearch
      
1. get jar from [https://github.com/elastic/elasticsearch-hadoop](https://github.com/elastic/elasticsearch-hadoop)
2. cp elasticsearch-hadoop-pig. for example to `` /usr/local/Cellar/pig/0.14.0/libexec/lib/``      

5.Run

    pig -x local load.pig

##ScreenShot
![Nginx Map with Ammap](screenshot.jpg)
![Nginx Map with ES Hadoop](screenshot_nginx_map.jpg)

