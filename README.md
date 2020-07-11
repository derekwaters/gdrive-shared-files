# gdrive-shared-files
Generate a list of all files shared from your Google Drive

Instructions:

1) In Google Drive, create a new empty Spreadsheet
2) Give your Spreadsheet a name ("My Shared Files")
3) Select Tools -> Script Editor
4) Select all the script contents and replace with the getSharedFiles script
5) Select File -> Save
6) Enter a Project Name and press OK
7) Close the script editor
8) Close your spreadsheet
9) Reopen your spreadsheet
10) After a brief pause, you should see a new "Shared Files" menu.
11) Firstly, select Shared Files -> Generate Folder List
12) You will be asked to "authorise" the new script project. 
13) Press Continue, then select your Google account.
14) You'll get a warning about the App not being authorised. Press the Advanced link.
15) Press Go to <project name> (unsafe)
16) Press Allow
17) You'll have to select Shared Files -> Generate Folder List again
18) A green "Running Script" message will be displayed, and a new SharedFiles tab should start to be populated.
19) When the script finishes, select Shared Files -> Get More Shared Files
20) This process takes a long time. It's possible that the script will exceed maximum execution time (6 minutes) before it gets through all your files. If that's the case, just run the script again and it will pick up where it left off.
21) When the script is done, you should get an "All Done" message box.
22) All of your Shared Files are listed on the "Shared Files" tab.
