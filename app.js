var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('underscore');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/Imovie');

app.set('views','./views/pages');
app.set('view engine','jade');
//app.use(express.bodyParser());改成如下
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.locals.moment = require('moment');
//app.set('port',3000);
app.listen(port);

console.log('Imovie is started in port ' + port);

//编写路由
//index page
app.get('/',function(req,res){
    Movie.fetch(function(err,movies) {
        if (err) {
            console.log(err);
        }
        
        res.render('index',{
            title: 'Imovie 首页',
            movies: movies
        })
    })

/*  伪造数据的方式    

    res.render('index',{
        title: 'Imovie 首页',
        movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 2,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 3,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 4,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 5,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 6,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 7,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 8,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    });
 */ 
})

//detail page
app.get('/movie/:id',function(req,res){
    var id = req.params.id;
    
    Movie.findById(id, function(err, movie) {
        res.render('detail',{
            title:'Imovie 详情页' + movie.title,
            movie: movie
        });
    });
    
/*  伪造数据 
    res.render('detail',{
        title:'Imovie 详情页',
        movie: {
            doctor: '何塞 帕蒂利亚',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNJAc8NTUy/v.swf',
            summary: '翻拍自1987年同名科幻经典，由.............'
        }
    });
 */    
})

//admin page
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'Imovie 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

//admin update movie
app.get('/admin/update/:id',function(req, res){
    var id = req.params.id;
    
    if(id) {
        Movie.findById(id, function(err, movie){
            res.render('admin', {
                title: 'Imovie 后台更新页',
                movie: movie
            })
        })
    }
});

// admin post movie
app.post('/admin/movie/new', function(req, res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    
    if(id !== 'undefined'){
        Movie.findById(id, function(err, movie){
            if(err){
                console.log(err)
            }
            
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie){
                if (err){
                    console.log(err)
                }
                
                res.redirect('/movie/' + movie._id);
            })
            
        })
    }else{
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        
        _movie.save(function(err,movie){
            if (err){
                console.log(err)
            }
            
            res.redirect('/movie/' + movie._id);
        })
    }
});

//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies) {
        if (err) {
            console.log(err);
        }
        
        res.render('list',{
            title: 'Imovie 列表页',
            movies: movies
        })
    })
    
/*  伪造数据
    res.render('list',{
        title:'Imovie 列表页',
        movies: [{
            _id: 1,
            doctor: '何塞 帕蒂利亚',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://g2.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNJAc8NTUy/v.swf'
        }]
    });
 */    
});

//list delete movie
app.delete('/admin/list',function(req, res){
    var id = req.query.id

    if(id){
        Movie.remove({_id: id}, function(err,movie) {
            if(err) {
                console.log(err)
            }else{
                res.json({success: 1})
            }
        })
    }
})