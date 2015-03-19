# PIPSQUEAK  
Mizzou Senior Capstone Project 2015  
  
Note:  	(╯°□°）╯︵ ┻━┻)  Changed all the things back to a normal git setup.  I didn't like the PIPSQUEAK folder thing with nw.js outside.  
		New instructions! Read below  
  
Development instructions:  
1. Download and Install Node.js (Make sure "npm" and "ADD TO PATH" is selected in the installation): http://nodejs.org/download/  
2. Test Node by running "npm -v" (no quotes) from a terminal.  Should show you the latest version.  
3. Run "npm install" and all the dependencies and NW.js will install automatically (if not already installed). 
  
To run the application:  
On all the platforms: open a terminal and type "npm start" from the project directory.  
  
-----------------------   
TESTING:  
	Setup:  
	run: npm install -g jasmine-node
	  
	Run All Tests:  
	run: jasmine-node specs
	OR  
	run: jasmine-node specs --verbose  
	  
	Run Single Test File:  
	run: jasmine-node specs/<filename>-spec.js
	  
	Write Tests:  
	Place all tests in the specs folder  
	IMPORTANT: End all test files with "-spec.js"  
	See example in tools-spec.js  
	  
	Notes:  
	When trying to nail down a single test, write it as iit (add an i to the it declaration).  
	This forces jasmine to skip all other tests, while you work on iit.  You can flag multiple  
	tests as iit at a time, just be sure to change them back to just 'it' after you are done.  
  
-----------------------   
Handy Quick Git reference (These should work no matter how you personally have Git setup):  

Typical Workflow:  
	git pull origin master  
	<do some work, change some stuff>
	git add -A  
	git commit -am"I changed a bunch O' stuff"
	git pull origin master
	git push origin master  

Clone  
	git clone https://github.com/SakoGuru/PIPSQUEAK.git  
Add  
	git add <filename>  
	git add -A  			//(ADDS ALL THE FILES)  
Commit  
	git commit -am"Message about the commit"
Pull  
	git pull origin master  
	git pull origin <branch name>  
Push  
	git push origin master  
	git push origin <branch name>  
Merge (sequence for safe merge)  
	git checkout master  
	git pull origin master  
	git merge <branch to be merged>  
	git push origin master  
Rebase (got a merge conflict)  
	<fix the files in conflict>
	git rebase --continue  
	git add -A  
	git status  			//Check if you have anything else to commit
	git push origin master  
