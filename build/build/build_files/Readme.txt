When creating these files the data in the manifest.plist needs to be 100% accurate or you will get an installation error.
The link to the manifest.plist file, located in index.html, also needs to have a trusted https connection for ios7+.

The index.html & Manifest.plist here can be used as templates but you will need to change the following fields
-index.html : 		link to manifest.plist
-manifest.plist: 	bundle version [info.plist]
-manifest.plist: 	bundle identifier [info.plist]
-manifest.plist: 	name/title [info.plist]
-manifest.plist: 	links to phonegapExample.ipa

Those marked with [info.plist] means the values can be found in a file called info.plist within the ipa file. To access is, follow the following instructions.


Simply rename the PhoneGapExample.ipa to phonegapExample.zip, then extract it with 7zip.

Inside this folder will be a file called info.plist, open that file with the plist editor and look at the bundle identifier, bundle version and name fields.

However to open the file without corrupted characters, you will need to use plist editor pro, found at this link http://plist-editor-for-windows.software.informer.com/1.0/

Once all the files are correct, you can use the download from url via a public link to index.html. Remember, if using dropbox, link formats need to be changed from the format of "dropbox.com/s/sdjkgherkah/sighiopa?dl=0" to "dl.dropboxusercontent/s/sdjkgherkah/sighiopa" this simply allows you to view the index.html and other files instead of download them.