/*
  (c) 2013 by Magnus Manske
  released under GPL V2+
*/

function runTool () {
	var server = $('#server').val() ;
	var photo_id = $('#photo_id').val() ;
	var categories = $('#categories').val().split("\n") ;
	if ( photo_id == '' ) {
		alert ( "At least gimme a photo ID, sir!" ) ;
		return ;
	}


	$.getJSON ( "g2c.php" , { server:server , photo_id:photo_id } , function ( d ) {
		var desc = $($(d.reuse).find("#wikipedia textarea")[0]).text() ;
		if ( desc == '' ) { alert ( "Could not get description - check photo ID" ) ; return }
		desc += "\n\n" ;
		$.each ( categories , function ( k , v ) {
			if ( v != '' ) desc += "[[Category:" + v + "]]\n" ;
		} ) ;
		desc = $.trim ( desc ) ;

		var title = [] ;
		$.each ( $(d.reuse).find("h2 a") , function ( k , v ) {
			v = $(v).text() ;
			if ( v != '' ) title.push ( v ) ;
		} ) ;
		title = title[1].replace(/'/g,'') + " (geograph " + photo_id + ").jpg" ;

		var hires_url = $($(d.main).find('#mainphoto img')).attr('src') ;
		$.each ( $(d.main).find('a[rel="license"]') , function ( k , v ) {
			var about = $(v).attr('about') ;
			if ( undefined === about ) return ;
			var m = about.match ( /\/\d+_([0-9a-f]+)\.jpg/ ) ;
			if ( m == null ) return ;
			hires_url = "http://www.geograph.org.uk/reuse.php?id=" + photo_id + "&download=" + m[1] + "&size=largest" ;
		} ) ;

		var h = "<div>Uploading image as \"" + title + "\"</div>" ;
		h += "<pre>" + desc + "</pre>" ;
		h += "<div><a href='" + hires_url + "'>Hi-Res image</a></div><hr/>" ;
		h += "<div id='uploading'><i>Uploading...</i></div>" ;
		$('#result_container').show().html(h);

		var params = {
			tusc_user : tusc.user ,
			tusc_password : tusc.pass ,
			url : hires_url ,
			new_name : title ,
			hotfix : 1 ,
			source : 'Geograph' ,
			desc : desc
		} ;
	
		$.post ( '/magnustools/php/upload_from_url.php' , params , function ( d2 ) {
			var tr = "" ;
			if ( d2.status == 'OK' ) {
				tr = "Now at : <a target='_blank' href='//commons.wikimedia.org/wiki/File:" + escape ( title ) + "'><tt>" + title + "</tt></a>" ;
			} else {
				var s = d2.status ;
				if ( d2.note !== undefined ) s += " (" + d2.note + ")" ;
				tr += "<br/><b>Transfer failed : " + s + "</b>" ;
			}
			$('#uploading').html ( tr ) ;
		} , 'json' ) ;
		

	} ) ;
	
}

$(document).ready ( function () {
	loadMenuBarAndContent ( { toolname : 'Geograph2Commons' , meta : 'Geograph2Commons' , content : 'form.html' , run : function () {
		tusc.setupLoginBar ( $('#tusc_container_wrapper') , function () {
			wikiDataCache.ensureSiteInfo ( [ { lang:'commons' , project:'wikimedia' } ] , function () {
	
				$('#toolname').html ( "Geograph-to-Commons" ) ;
				tusc.initializeTUSC () ;
				tusc.addTUSC2toolbar() ;
				$('#photo_id').focus() ;
				
				
				$('#server').tooltip ( { placement : 'right' , trigger: 'hover' } ) ;
				$('#photo_id').tooltip ( { placement : 'right' , trigger: 'hover' } ) ;
				$('#categories').tooltip ( { placement : 'right' , trigger: 'hover' } ) ;

				var params = getUrlVars() ;
				if ( undefined !== params.tusc_user ) $('#tusc_user').val ( decodeURIComponent(params.tusc_user) ) ;
				if ( undefined !== params.tusc_pass ) $('#tusc_pass').val ( decodeURIComponent(params.tusc_pass) ) ;
				if ( undefined !== params.server ) $('#server').val ( decodeURIComponent(params.server) ) ;
				if ( undefined !== params.photo_id ) $('#photo_id').val ( decodeURIComponent(params.photo_id) ) ;
				if ( undefined !== params.categories ) $('#categories').val ( decodeURIComponent(params.categories) ) ;
				
			} ) ;
		} ) ;
	} } )
} ) ;
