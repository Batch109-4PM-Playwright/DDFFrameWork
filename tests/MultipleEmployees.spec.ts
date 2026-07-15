
import {test , expect} from '@playwright/test'
import fsdata from 'fs'
import myexcel from 'xlsx'

test.describe("Test Scenario of Adding Multiple Employees", ()=>
{

    let page : any;
    let context;
    test.beforeAll("Launching the Application", async({browser})=>{   //pre-conditions
            context = await browser.newContext({
                recordVideo:{
                    dir: "./TestVideos/",
                    size: {width : 1280 , height : 720}
                }
            });
            page = await context.newPage();
     await page.goto("http://127.0.0.1/orangehrm-2.5.0.2/login.php") ;
     await page.waitForTimeout(2000);
       

     console.log("Application Launched Successfully");
     
    })

    test("Test case on Adding Mutiple Employees", async()=>
    {
        test.setTimeout(900000);
       
        const jsonData = JSON.parse(
    fsdata.readFileSync("./Datajson/locator.json", "utf-8")
);
         function readExcel(filepath : string , sheetName : string) : any
        {
            const wb = myexcel.readFile(filepath);
            const ws : any = wb.Sheets[sheetName];
            const edata = myexcel.utils.sheet_to_json(ws ,  {header : 1});
            return edata;
        }
        const UNPWDData = readExcel("./ExcelData/OrangeHRM.xlsx", "Credentails");
                        
        await page.locator(jsonData.XUN).fill(UNPWDData[1][0]);
        await page.locator(jsonData.XPWD).fill(UNPWDData[1][1]);
        await page.waitForTimeout(2000);
        await page.locator(jsonData.XSUB).click();
        await page.waitForTimeout(2000);
        await expect(page).toHaveTitle("OrangeHRM");
        console.log("Successfully Logged into the application")
        await page.screenshot({path: "./TestEvidences/AfterLogin.jpg"});
         const EData = readExcel("./ExcelData/OrangeHRM.xlsx", "EmpData");  //reading excel employee data

       // console.log("The Number os Employees from the excel is : " +EData.length);
      for(let e : number = 1 ; e < EData.length ; e++)
     // for(let e : number = 1 ; e <= 2 ; e++)
       {
        await page.waitForTimeout(2000);
        await page.locator(jsonData.XPIM).hover();
        await page.waitForTimeout(1000);
        await page.locator(jsonData.XADD).click();  //cliked on add employee and navigated to Add employee page
        await page.waitForTimeout(2000);

        const F = page.frameLocator(jsonData.XFRAME);

       
        await F.locator(jsonData.XID).fill(EData[e][0].toString());  //number to string
        await F.locator(jsonData.XFIRST).fill(EData[e][1]);
        await F.locator(jsonData.XLAST).fill(EData[e][2]);
        await F.locator(jsonData.XMID).fill(EData[e][3]);
        await F.locator(jsonData.XNICK).fill(EData[e][4]);


        await page.waitForTimeout(2000);

        await F.locator(jsonData.XPHOTO).setInputFiles("./EmpPhotos/" +EData[e][1] +".jpg")
        await page.waitForTimeout(500);
        
        await page.screenshot({path: "./TestEvidences/"+EData[e][1]+"_BeforeSave.jpg"});

        await F.locator(jsonData.XSAVE).click();

        await page.waitForTimeout(4000);

       await page.screenshot({path: "./TestEvidences/"+EData[e][1]+"_AfterSave.jpg"});

        await F.locator(jsonData.XBACK).click();

         console.log(EData[e][1] +" , Added Successfully");
        
        await page.waitForTimeout(2000);
       await page.screenshot({path: "./TestEvidences/"+EData[e][1]+"_AfterAdd.jpg"});
       } //end of for loop

    }  //test case end
)





})