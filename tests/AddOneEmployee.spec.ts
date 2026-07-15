
import {test , expect} from '@playwright/test'
import fsdata from 'fs'
import myexcel from 'xlsx'

test.describe("Test Scenario of Adding One Employee", ()=>
{

    let page : any;
    let context;
    test.beforeAll("Launching the Application", async({browser})=>{   //pre-conditions
            context = await browser.newContext();
            page = await context.newPage();
     await page.goto("http://127.0.0.1/orangehrm-2.5.0.2/login.php") ;
     await page.waitForTimeout(2000);
       

     console.log("Application Launched Successfully");
     
    })

    test("Test case on Adding one Employee", async()=>
    {
        test.setTimeout(900000);
       
        const jsonData  = JSON.parse(fsdata.readFileSync("./Datajson/locator.json"));
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
        await page.waitForTimeout(2000);
        await page.locator(jsonData.XPIM).hover();
        await page.waitForTimeout(1000);
        await page.locator(jsonData.XADD).click();  //cliked on add employee and navigated to Add employee page
        await page.waitForTimeout(2000);

        const F = page.frameLocator(jsonData.XFRAME);

        const EData = readExcel("./ExcelData/OrangeHRM.xlsx", "EmpData");  //reading excel employee data

        await F.locator(jsonData.XID).fill(EData[1][0].toString());  //number to string
        await F.locator(jsonData.XFIRST).fill(EData[1][1]);
        await F.locator(jsonData.XLAST).fill(EData[1][2]);
        await F.locator(jsonData.XMID).fill(EData[1][3]);
        await F.locator(jsonData.XNICK).fill(EData[1][4]);


        await page.waitForTimeout(2000);

        await F.locator(jsonData.XPHOTO).setInputFiles("C:/My Personal/Batches/Batch3PM_Selenium/Images/Break_Continue.jpg")
        
       

        await page.waitForTimeout(500);

        await F.locator(jsonData.XSAVE).click();

        await page.waitForTimeout(4000);

        await F.locator(jsonData.XBACK).click();

         console.log(EData[1][1] +" , Added Successfully");
        
        await page.waitForTimeout(2000);


    })





})