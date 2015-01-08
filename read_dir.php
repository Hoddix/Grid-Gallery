<?php

$dir = $_POST['dir'].'/';
 
if (is_dir($dir)) {

    if ($dh = opendir($dir)) {
    
		$imgs = array();
        $idx = 0;

        while (($file = readdir($dh)) !== false) {
    
        	if($file != '.' && $file != '..' && $file != '.DS_Store'){
	
	            list($width, $height) = getimagesize($dir.$file);

	            $imgs[$idx]= [
	            	'file'=>$file,
	            	'width'=>$width,
	            	'height'=>$height
	            ];

	            $idx++;

        	}
        
        }
        
        closedir($dh);

        echo json_encode($imgs);
    
    }

}


?>