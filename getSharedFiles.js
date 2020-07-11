function onOpen ()
{
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    { name: "Generate Folder List...", functionName: "generateFolderList" },
    { name: "Get More Shared Files...", functionName: "getMoreSharedFiles" }
    ];
  spreadsheet.addMenu('Shared Files', menuItems);
}

function generateFolderList() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var findSheet = spreadsheet.getSheetByName("FolderList");
  if (findSheet === null)
  {
    findSheet = spreadsheet.insertSheet("FolderList");
  }
  else
  {
    findSheet.clearContents();
  }
  findSheet.clearContents();
  findSheet.appendRow(["Name", "Path", "Id", "Complete"]); //writes the headers
  
  var folder = DriveApp.getRootFolder();
  findSheet.appendRow(["", "", folder.getId(), false]);
  
  generateChildFolderList(folder, findSheet, "");
}

function generateChildFolderList(folder, findSheet, parentPath)
{
  var subfolders = folder.getFolders();

  var fullSubfolder;
  while (subfolders.hasNext()) {
    var name = subfolders.next();
    
    if (name.toString() !== "Google Photos" &&
        name.toString() !== "Photos")
    {
      fullSubfolder = parentPath + name.toString() + "\\";
      findSheet.appendRow([name.toString(), fullSubfolder, name.getId(), false]);
      generateChildFolderList(name, findSheet, fullSubfolder);
    }
  }
}

function getMoreSharedFiles ()
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var findSheet = spreadsheet.getSheetByName("FolderList");
  if (findSheet === null)
  {
    Browser.msgBox("You need to generate the folder list first!");
  }
  
  var sharedSheet = spreadsheet.getSheetByName("SharedFiles");
  if (sharedSheet === null)
  {
    sharedSheet = spreadsheet.insertSheet("SharedFiles");
    sharedSheet.appendRow(["Name", "Folder", "Sharing Access", "Sharing Permission", "Get Editors", "Get Viewers", "Date", "Size", "URL", "Download", "Description", "Type"]);
  }
  
  var firstRow = 2;
  var lastRow = findSheet.getLastRow();
  var rowData = findSheet.getRange(firstRow, 1, lastRow, 4);
  var rowDataArray = rowData.getValues();
  for (var row in rowDataArray)
  {
    var theRow = rowDataArray[row];
    if (theRow[3] === false)
    {
      scanFolderFiles(sharedSheet, theRow[2], theRow[0], theRow[1]);
      var actualRow = firstRow + parseInt(row);
      var doneRange = findSheet.getRange(actualRow, 4);
      doneRange.setValue(true);
    }
  }
  Browser.msgBox("All done!");
}

function scanFolderFiles (sharedSheet, folderId, folderName, folderPath)
{
  var folder = DriveApp.getFolderById(folderId);
  if (folder !== null)
  {
    getLooseFiles(folder, sharedSheet, folderPath);
  }
}






function listFolders(folder) {
     var sheet = SpreadsheetApp.getActiveSheet();
     sheet.clearContents();
     sheet.appendRow(["Name", "Folder", "Sharing Access", "Sharing Permission", "Get Editors", "Get Viewers", "Date", "Size", "URL", "Download", "Description", "Type"]); //writes the headers
     
     //instead of getting folder by ID rather get all folders and cycle through each. Note this will miss loose files in parent directory.
     var folder = DriveApp.getRootFolder();
     getLooseFiles(folder, sheet, "");
     getSubFolders(folder, sheet, "");
  
  Logger.log("All Done!");
 }

function getSubFolders(folder, sheet, folderPath) {
     var subfolders = folder.getFolders(); //same thing as above but for all the subfolders in the folder

     var fullSubfolder;
     while (subfolders.hasNext()) {
         var name = subfolders.next();
       
         if (name.toString() !== "Google Photos" &&
             name.toString() !== "Photos")
         {
           
           
           fullSubfolder = folderPath + name.toString() + "\\";
           // sheet.appendRow(["Folder", fullSubfolder]);
           getLooseFiles(name, sheet, fullSubfolder);
           getSubFolders(name, sheet, fullSubfolder);
         }
      };
}

function getLooseFiles(folder, sheet, subfolder) {
     var files = folder.getFiles();//initial loop on loose files w/in the folder
     var cnt = 0;
     var file;
     var sharingAccess;

     while (files.hasNext()) {
         var file = files.next();
       
       
         // sheet.appendRow(["File", file.getName()]);
         // continue;
       
         sharingAccess = file.getSharingAccess();
       
       var listEditors = file.getEditors(); //gets the editor email(s), doesn't show your own as it's assumed
       var editors = [];
       for (var cnt = 0; cnt < listEditors.length; cnt++) {
         editors.push(listEditors[cnt].getEmail());
       };
       var listViewers = file.getViewers(); //gets the viewer email(s)
       var viewers = [];
       for (var cnt = 0; cnt < listViewers.length; cnt++) {
         viewers.push(listViewers[cnt].getEmail());
       }
       
       if (sharingAccess != "PRIVATE" || editors.length > 0 || viewers.length > 0)
       {
         data = [
           file.getName(),
           subfolder,
           file.getSharingAccess(),
           file.getSharingPermission(),
           editors.toString(),
           viewers.toString(),
           file.getDateCreated(),
           file.getSize(),
           file.getUrl(),
           "https://docs.google.com/uc?export=download&confirm=no_antivirus&id=" + file.getId(),
           file.getDescription(),
           file.getMimeType(),
         ];
         sheet.appendRow(data);
       }
     }

}
