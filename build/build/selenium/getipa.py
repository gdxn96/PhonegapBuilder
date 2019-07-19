import time, os, math, zipfile
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import getpass
import shutil

global browser
email = "example@email.com"
password = "example_password"
project_folder_name = "example_project_directory"
app_id = "1568714"

def get_directory():
    """ Helper function
    Gets directory of project folder
    """
    global project_folder_name
    projectFolder = ""
    while project_folder_name not in os.listdir():
        upperDir = os.path.normpath(os.getcwd() + os.sep + os.pardir)
        os.chdir(upperDir)
    else:
        projectFolder = os.getcwd()

    return projectFolder

def zip_folder():
    """ Helper function
    Remove any current .zip folder
    Zips up the new project folder
    """
    # Go to file directory containing folder name
    os.chdir(get_directory())

    # Remove all zip files if there are any
    for file in os.listdir(os.getcwd()):
        if file.endswith(".zip"):
            os.remove(file)

    # Now zip up the project folder
    global project_folder_name
    ziph = zipfile.ZipFile(project_folder_name + '.zip', 'w')
    projectFile = project_folder_name

    shutil.make_archive("Project", "zip", projectFile)

def remove_ipa_files():
    """ Helper function
    Removes any .ipa file currently in the build_files folder
    Removes any .part file currently in the build_files folder
    """
    # Get rid of any ipa files in the "build_files" folder
    os.chdir(get_directory() + "\Build")
    os.chdir("build_files")

    for file in os.listdir(os.getcwd()):
        if file.endswith(".ipa"):
            os.remove(file)
        if file.endswith(".part"):
            os.remove(file)

def check_download_complete():
    """ Helper function
    Will check that the .ipa file is fully downloaded
    """
    finishDownload = False
    fileSizeBefore = 0
    fileSizeAfter = 0
    ipaThere = False

    # See if the .ipa file exists
    for file in os.listdir(os.getcwd()):
        if file == "PhoneGapExample.ipa":
            ipaThere = True;

    # If it exists, get it's size before and after
    if ipaThere:
        # Get size of file before sleep
        fileSizeBefore = os.path.getsize("PhoneGapExample.ipa")

        time.sleep(0.1)

        # Get size of file after sleep
        fileSizeAfter = os.path.getsize("PhoneGapExample.ipa")

        # Now compare size before and after
        # If both are the same and one is not zero
        # then the download is complete
        if fileSizeBefore == fileSizeAfter and fileSizeBefore != 0:
            finishDownload = True

    return finishDownload

def setUp(email, password):

    # Bypasses the download window popup for phonegap
    profile = webdriver.FirefoxProfile()
    profile.set_preference("browser.download.folderList", 2)
    profile.set_preference("browser.download.manager.showWhenStarting",
                        False)
    profile.set_preference("browser.download.dir",
                        get_directory()+'\Build\build_files')
    profile.set_preference("browser.helperApps.neverAsk.saveToDisk",
                        "application/octet-stream")

    browser = webdriver.Firefox(profile)

    # Go to the phonegap sign in page
    url = "https://build.phonegap.com/people/sign_in"
    browser.get(url)

    # Click the sign in link
    wait = WebDriverWait(browser, 10)
    element = wait.until(EC.element_to_be_clickable((By.LINK_TEXT,
                        'Sign in with Adobe ID')))
    element.click()

    # Enter username
    element = browser.find_element_by_id("adobeid_username")
    element.send_keys(email)

    # Enter password
    element = browser.find_element_by_id("adobeid_password")
    element.send_keys(password)

    # Click the sign in button
    element = browser.find_element_by_id("sign_in")
    element.click()


def upload_ipa_file():
    """ Test function
    Uploads the .zip file to phonegap
    Then makes an assertion to see if the .ipa file is downloaded
    """
    global browser

    # Remove any current zip file and zip up the project folder
    zip_folder()

    # Click the update code button
    wait = WebDriverWait(browser, 10)
    element = wait.until(EC.element_to_be_clickable((By.LINK_TEXT,
                        'Update code')))
    element.click()

    # Now with the browse label, send the zip file to phonegap
    path = os.path.abspath(get_directory() + "\Project.zip")
    global app_id
    element = browser.find_element_by_id("app_archive-" + app_id)
    element.send_keys(path)

    # Click the upload button
    element = browser.find_element_by_name("commit")
    element.click()

    # Get rid of any ipa files in the "build_files" folder
    remove_ipa_files()

    # Click the IPA button when it is READY to be clicked,
    # this will download the new ipa file
    # which will be placed in the "build_files" folder
    wait = WebDriverWait(browser, 600)
    element = wait.until(EC.element_to_be_clickable((By.LINK_TEXT,'ipa')))
    element.click()

    # Remove the zip file
    os.chdir(get_directory())
    for file in os.listdir(os.getcwd()):
        if file.endswith(".zip"):
            os.remove(file)

    # Now we wait for the download to finish
    os.chdir(get_directory() + "\Build")
    os.chdir("build_files")

    finishDownload = False
    while finishDownload == False:
        finishDownload = check_download_complete()

    # Make an assertion to see if the .ipa file exists
    for file in os.listdir(os.getcwd()):
        if file == "PhoneGapExample.ipa":
            ipaThere = True;

    assert(ipaThere is True)

    browser.quit()



if __name__ == "__main__":
    # email = input("Enter Phonegap Email/Adobe ID: ")
    # password = getpass.getpass()
    # setUp(email, password)
    global email
    global password
    setUp(email, password)
    upload_ipa_file()