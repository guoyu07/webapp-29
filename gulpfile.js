//CSSѹ����css��������ͼƬ��ժҪ
var gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),//cssѹ��
    csslint = require('gulp-csslint'),//css���
    //ȷ���ѱ��ذ�װgulp-make-css-url-version []
    cssver = require('gulp-make-css-url-version'),
    rev    = require('gulp-rev'),    //- ���ļ�����MD5��׺
    notify = require('gulp-notify'),//����
    manifest = require('gulp-appcache'),//ǰ�˻���
    revCollector = require('gulp-rev-collector'),//ִ���ļ���css�����滻 
    watch = require('gulp-watch'),//ֻ���±��뱻���Ĺ����ļ�
    jshint = require('gulp-jshint'),//Link�������js/Ŀ¼�µ�js�ļ���û�б���򾯸档
    fs = require('fs');
    fontmin = require('gulp-fontmin'),//Gulp plugin for minify TTF font to SVG, EOT, WOFF
    minifyHTML   = require('gulp-minify-html');//ѹ��html
    htmlmin = require('gulp-htmlmin');//ѹ��html
    pngquant = require('imagemin-pngquant'),//���ѹ��
    cache = require('gulp-cache'),//����������ʹ�û��棬��������֮ǰ�������ͼƬ
    imagemin = require('gulp-imagemin'); //ͼƬѹ��
    rename = require('gulp-rename'),//�ļ���������
    uglify = require('gulp-uglify'),//jsѹ��
    concat = require('gulp-concat'),//�ļ��ϲ�
    fs = require('fs');//��ȡ�����ļ�
	 var json = JSON.parse(fs.readFileSync('./package.json','utf-8'));    
	 var manifestAr = [];
	 var obj = json.manifest;

	 for(var i=0;i<obj.length;i++)
	 {
		 var temp = obj[i];
		 manifestAr.push(temp);
	 }     
 var buildPath = json.path?json.path:json.name;
 var sourceDest = 'deploy/'+json.version+"/"+json.verType+'/source-'+json.name;//Դ�������Ŀ¼
 var sourcehHseaDest = 'deploy/'+json.version+"/"+json.verType+'/source-'+json.frameworkVersion;//Դ�������Ŀ¼
 
 var cssDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//CSS�ļ����·��
 var jsDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//JS�ļ����·�� 
 var imgDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//img�ļ����·��
 var fontDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//�����ļ����·��
 var pluginsDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//����ļ����·��
 var htmlDest = rootDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//html�ļ����·��,��Ŀ��

 
 
 var cacheMfDest = htmlDest;//ǰ��cachemainfest�ļ����·��
 var manifestDest = htmlDest+"manifest.json";//����md5���ձ�·���͸�ʽ    
 var revcssDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.css';//�滻css�ļ������·��
 var revhtmlDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.html';//�滻html����汾·��
 var revpluginsCssDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.css';
 var revjsDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.js';
 var revjsPluginsDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.js';
 var revmainfestDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/app.appcache';
 var frameDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.frameworkVersion+'/';
 var hseaDest = json.frameworkVersion+'/';//���HSEA����Ŀ¼
 

//JS���ϲ�ѹ��������
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

//����Դ�ļ�
function sourceSave(){    
     return gulp.src([buildPath+'/**/*'])
        .pipe(gulp.dest(sourceDest))
           .pipe(notify({ message: 'sourceSave do finished' })); 
}

//���ݿ���ļ�
function sourceHseaSave(){    
     return gulp.src([hseaDest+'/**/*'])
        .pipe(gulp.dest(sourcehHseaDest))
           .pipe(notify({ message: 'sourceSave do finished' })); 
}

//����package.json
function sourcePkgSave(){    
     return gulp.src('./package.json')
        .pipe(gulp.dest(sourceDest))
           .pipe(notify({ message: 'package do finished' })); 
}
//����ѹ��,Gulp plugin for minify TTF font to SVG, EOT, WOFF
function fontmins(){
     return gulp.src([buildPath+'/font/*.woff'])
        .pipe(fontmin({
            text: 'font',
         }))
        .pipe(gulp.dest(fontDest))//ͳһ����js��css��html�ļ���һ��Ŀ¼��һ���ļ���
        .pipe(notify({ message: 'font min do finished' }));
        
}

//css���
function csslints(){
     return gulp.src([buildPath+'/css/**/*.css'])
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.reporter('fail'))
        .pipe(notify({ message: 'css lint do finished' }));
        
}

//css�Ⱥϲ�ѹ��
function cssmins(){
     return gulp.src([buildPath+'/**/*.css'])
        //.pipe(cssver()) //��css�ļ��������ļ��Ӱ汾�ţ��ļ�MD5��,�޸����ļ����� һ��Ҫ���������µ�css����������б仯��URL�仯��û�仯��URL��MD5����䣩
        //.pipe(concat('main.css'))
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(gulp.dest(cssDest))        
        .pipe(cssmin())
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(cssDest))//����ļ�
        .pipe(rev.manifest({path:manifestDest},{//���ɵ�Ŀ¼�ڸ�����
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/css/'))  //��������css��md5 mainifest�ļ������Ŀ¼
        .pipe(gulp.dest(rootDest))//ͳһ����js��css��html�ļ���һ��Ŀ¼��һ���ļ���
        .pipe(notify({ message: 'css do finished' }));
        
}

//�������css�Ⱥϲ�ѹ��
function csspluginsmins(){
     return gulp.src([buildPath+'/**/*.css'])
        .pipe(cssmin())
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(pluginsDest))//����ļ�
        .pipe(rev.manifest({path:manifestDest},{//���ɵ�Ŀ¼�ڸ�����
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        .pipe(gulp.dest(rootDest))//ͳһ����js��css��html�ļ���һ��Ŀ¼��һ���ļ���
        .pipe(notify({ message: 'css plugins do finished' }));        
}



  // ���js
function jshints(){
    return gulp.src([buildPath+'/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'js do finished' }));
    
          //,�ų�ʹ��'!src/js/**/{test3}.js'

};
 

//js���̺ϲ�ѹ��
function jsmins(){
      var config = {
        mangle: {except: ['define', 'require', 'module', 'exports','$']},//���ͣ�Boolean Ĭ�ϣ�true �Ƿ��޸ı�����
        compress:  {
         drop_console: true
    },//���ͣ�Boolean Ĭ�ϣ�true �Ƿ���ȫѹ��
//       preserveComments: 'all' //��������ע��
    };
    return gulp.src([buildPath+'/**/*.js'])//,�ų�ʹ��'!src/js/**/{test3}.js'
        //.pipe(concat('all.js'))
        //.pipe(gulp.dest(jsDest))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(uglify(config))    //ѹ��
        //.pipe(rename({suffix: '.min'}))   //renameѹ������ļ���       
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(jsDest)) 
 
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/js'))    //js��������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'js do finished' }));
        
}

//ѹ��plugins���JS
function jspluginsmins(){
      var config = {
        mangle: {except: ['define', 'require', 'module', 'exports']},
        compress: false
    };
    return gulp.src([buildPath+'/**/*.js'])//,�ų�ʹ��'!src/js/**/{test3}.js'
        .pipe(uglify(config))    //ѹ��    
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(pluginsDest))  //ע����������ڸ�Ŀ¼����
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/js'))    //js��������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'js plugins do finished' }));
        
}


//վ��favicoͼƬ����
function imageFavmins(){
    var imgSrc = buildPath+'/images/favicon.ico';
     return gulp.src([imgSrc])
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))        
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'favicon do finished' }));
        
}

//��Ŀ����ͼƬ����
function imagemins(){
    var imgSrc = buildPath+'/**/*.{png,jpg,gif,ico}';
     return gulp.src([imgSrc])
        //.pipe(imagemin())
        /* .pipe(imagemin({
            optimizationLevel: 5, //���ͣ�Number  Ĭ�ϣ�3  ȡֵ��Χ��0-7���Ż��ȼ���
            progressive: true, //���ͣ�Boolean Ĭ�ϣ�false ����ѹ��jpgͼƬ
            interlaced: true, //���ͣ�Boolean Ĭ�ϣ�false ����ɨ��gif������Ⱦ
            multipass: true //���ͣ�Boolean Ĭ�ϣ�false ����Ż�svgֱ����ȫ�Ż�
        }))*/
       
        //���ѹ��ͼƬ
        /*.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//��Ҫ�Ƴ�svg��viewbox����
            use: [pngquant()] //ʹ��pngquant���ѹ��pngͼƬ��imagemin���
        }))*/
        /*����
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))*/
        //
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(imgDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/img'))//ͼƬ��������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'img do finished' }));
        
}

//�������ͼƬ����
function imagepluginsmins(){
    var imgSrc = buildPath+'/**/*.{png,jpg,gif,ico}';
     return gulp.src([imgSrc])        
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(pluginsDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/img'))//ͼƬ��������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'img plugins do finished' }));
        
}


function htmlmins(){
    var options = {
        removeComments: true,//���HTMLע��
        collapseWhitespace: true,//ѹ��HTML
        collapseBooleanAttributes: true,//ʡ�Բ������Ե�ֵ <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//ɾ�����пո�������ֵ <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//ɾ��<script>��type="text/javascript"
        removeStyleLinkTypeAttributes: true,//ɾ��<style>��<link>��type="text/css"
        minifyJS: true,//ѹ��ҳ��JS
        minifyCSS: true//ѹ��ҳ��CSS

    };
     return gulp.src([buildPath+'/**/*.html','!'+json.name+'/**/docs.html','!'+json.name+'/**/oldapi.html'])
        .pipe(htmlmin(options))
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(htmlDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest(rootDest))//ҳ�浥������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'html do finished' }));
        
}

//ѹ�����MD5�ļ���(JS)
function hseamins(){
      var config = {
        mangle: {except: ['define', 'require', 'module', 'exports','$']},//���ͣ�Boolean Ĭ�ϣ�true �Ƿ��޸ı�����
        compress: true,//���ͣ�Boolean Ĭ�ϣ�true �Ƿ���ȫѹ��
    };
    return gulp.src([hseaDest+'**/*.js'])//,�ų�ʹ��'!src/js/**/{test3}.js'
        .pipe(uglify(config))    //ѹ��
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(frameDest)) 
 
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/js'))    //js��������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'hseamins do finished' }));
        
}

function hseaminscss(){
     return gulp.src([hseaDest+'/**/*.css'])
        .pipe(cssmin())
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(frameDest))//����ļ�
        .pipe(rev.manifest({path:manifestDest},{//���ɵ�Ŀ¼�ڸ�����
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        .pipe(gulp.dest(rootDest))//ͳһ����js��css��html�ļ���һ��Ŀ¼��һ���ļ���
        .pipe(notify({ message: 'hseaminscss do finished' }));
        
}

function hseaminsImage(){
    var imgSrc = hseaDest+'/**/*.{png,jpg,gif,ico}';
     return gulp.src([imgSrc])
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(rev())  //- �ļ�����MD5��׺
        .pipe(gulp.dest(frameDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //����md5�����ļ�
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/img'))//ͼƬ��������md5�����ļ�
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'img do finished' }));
        
}


//����ǰ�˻���mainfest�ļ�

function manifests(){
	if(manifestAr.length >0)
	{
	    return gulp.src(manifestAr)//�����²���Ҫ���ӻ����ļ�
	        .pipe(manifest({
	          relativePath: '../',
		      hash: true,
		      preferOnline: true,
		      network: ['*'],
		      filename: 'app.appcache',
		      exclude: 'app.appcache'	              
	         }))
	        .pipe(gulp.dest(cacheMfDest))
	        .pipe(notify({ message: 'ǰ�˻���mainfest�޸����' }));
    }else{
    	return gulp.src([hseaDest]).pipe(notify({ message: 'ǰ�˻���mainfest�޸����(δִ��)' }));  
    }
        
}



/*������md5 json�ļ���һ���ļ��еĴ���ʽ,�滻�ļ���·��*/

function revhsea(){
     return gulp.src([manifestDest, frameDest+'**/*.js'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(frameDest))
        .pipe(notify({ message: 'revhsea rev cover do finished' }));
        
}

function revhtml(){
     return gulp.src([manifestDest, revhtmlDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'html rev cover do finished' }));
        
}

function revcss(){
     return gulp.src([manifestDest, revcssDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(cssDest))
        .pipe(notify({ message: 'css rev cover do finished' }));
        
}

function revfluginscss(){
     return gulp.src([manifestDest, revpluginsCssDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(cssDest))
        .pipe(notify({ message: 'pluginscss rev cover do finished' }));
        
}

function revjs(){
     return gulp.src([manifestDest, revjsDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(jsDest))
        .pipe(notify({ message: 'js rev cover do finished' }));
        
}

function revpluginsjs(){
     return gulp.src([manifestDest, revjsPluginsDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(jsDest))
        .pipe(notify({ message: 'js rev cover do finished' }));
        
}

function revcachemainfest(){
	if(manifestAr.length >0)
	{
		 return gulp.src([manifestDest, revmainfestDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'md5manifest rev cover do finished' }))
	}else
	{
		return gulp.src([hseaDest]).pipe(notify({ message: 'revcachemainfest(δִ��)' })); 
	}

        
}



/*
gulp 4.0 series���������˳��ִ�еģ�parallel���������ͬ��ִ�еġ�
*/

//gulp.task('default', gulp.series(sourceSave,sourcePkgSave,fontmins,cssmins,csspluginsmins,/*jshints,*/jsmins,jspluginsmins,imageFavmins,imagemins,imagepluginsmins,htmlmins,manifests,revcss,revfluginscss,revjs,revpluginsjs,revhtml,revcachemainfest));
gulp.task('default', gulp.series(sourceHseaSave,sourceSave,sourcePkgSave,fontmins,cssmins,/*csspluginsmins��jshints,*/jsmins,/*jspluginsmins,imageFavmins,*/imagemins/*,imagepluginsmins*/,htmlmins,hseamins,hseaminscss,hseaminsImage,manifests,revhsea,revcss,revjs,revhtml,revcachemainfest));





