# Bigbasket Scarping With google script in Google sheet
Scrap bigbasket all data

## How to?
1. Create a blank google sheet (https://docs.google.com/spreadsheets/)
2. Add five sheet with the names (case-sensitive)
	- products (it keeps product list)
	- categories (it keeps category list)
	- brands (it keeps brand list)
	- error (if a url not fetch or show error it keeps those)
	- cache (it keeps last page u scrap)
3. open the script editor (you can find in tools) and copy the script.js in editor
4. select function 'loadmenu' and run (allow the permission) 
5. go back to the sheet and you will find a new menu "Scrap Data". Hover on "Scrap Data" and click on "fetch category and brand" it will start fetch category and brand.
6. when fetching of category and brand completed then Hover on "Scrap Data" and click on "fetch product" for start fetching product list.
### [Sample Google sheet file](https://docs.google.com/spreadsheets/d/1cKoySwZ6c976NJS8dpWpftehaW3gbJGYXQLaAKzvXbY/edit?usp=sharing)
#### Note: google script can run up to 15- 20 mins at once so you have to repeat step 6 till it fetch all data

#### Note: if api not working then try to change cookies
