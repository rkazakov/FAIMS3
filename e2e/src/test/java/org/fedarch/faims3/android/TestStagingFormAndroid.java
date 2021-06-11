/*
 * Copyright 2021 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: TestStagingForm.java
 * Description:
 *   TODO
 */

package org.fedarch.faims3.android;

import static org.junit.Assert.assertEquals;

import java.lang.reflect.InvocationTargetException;
import java.net.MalformedURLException;

import org.fedarch.faims3.AstroSky;
import org.fedarch.faims3.TestStagingForm;
import org.fedarch.faims3.TestUtils;
import org.json.JSONException;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.appium.java_client.MobileBy;
import io.appium.java_client.android.AndroidElement;

/**
 * Test populate the fields on the Android app:
 * https://faimsproject.atlassian.net/browse/FAIMS3-153
 *
 * @author Rini Angreani, CSIRO
 *
 */
public class TestStagingFormAndroid extends AndroidTest implements TestStagingForm {

  @BeforeClass
  public static void setup() throws MalformedURLException {
	  // Test with browserstack by default
	  // Change to true for local test connection
	  AndroidTest.setup(false, "Test staging new Test Project observation form (Android)");
  }

  /**
   * This test scenario is when you put in all the mandatory fields and switch to another project on the top tab.
   * When you open the form again, it should have saved the previous values.
   *
   * @throws JSONException
   * @throws MalformedURLException
   * @throws NoSuchMethodException
   * @throws SecurityException
   * @throws IllegalAccessException
   * @throws IllegalArgumentException
   * @throws InvocationTargetException
   */
  @Override
@Test
  public void testSwitchTab() throws JSONException {
	  try {
			// Go to AstroSky form
			loadNewAstroSkyForm();
			// Fill out all fields
			fillOutFormWithValidFields();
			TestUtils.scrollDown(driver);
			// validate JSON values
			validateJSON();
			// scroll up and click on the "Example Project A" tab
			TestUtils.scrollToResourceId(driver, "project-nav-scrollable-tab-projectB").click();
			// click submit before opening AsTRoSkY tab again
			WebDriverWait wait = new WebDriverWait(driver, 10);
			wait.until(ExpectedConditions.elementToBeClickable(MobileBy.xpath("//*[@text='SAVE AND NEW']"))).click();;
			// reopen AsTRoSkY
			driver.findElement(MobileBy.xpath("//*[@resource-id='project-nav-scrollable-tab-astro_sky']")).click();
			// Check all fields are still the same
			validateLatLong();
			assertEquals(AstroSky.EMAIL, driver.findElement(MobileBy.xpath("//*[@resource-id='email-field']")).getText());
			assertEquals(AstroSky.COLOUR, driver.findElement(MobileBy.xpath("//*[@resource-id='str-field']")).getText());

			AndroidElement currencies = TestUtils.scrollToResourceId(driver, "multi-str-field");
			assertEquals(AstroSky.UNICODE, currencies.getText());

			TestUtils.scrollDown(driver);

			assertEquals("1.0", wait.until(
					ExpectedConditions.visibilityOfElementLocated(
							MobileBy.xpath("//*[@resource-id='int-field']"))).getText());
			assertEquals("Currency €", driver.findElement(MobileBy.xpath("//*[@resource-id='select-field']")).getText());
			assertEquals("Currencies $, €", driver.findElement(MobileBy.xpath("//*[@resource-id='multi-select-field']")).getText());
			assertEquals("true", driver.findElement(MobileBy.xpath("//*[@resource-id='checkbox-field']")).getAttribute("checked"));
			for (AndroidElement radioButton : driver.findElementsByClassName("android.widget.RadioButton")) {
				if (radioButton.getText().equals("4")) {
					// the fourth radio button should be selected
					assertEquals("true", radioButton.getAttribute("checked"));
				} else {
					assertEquals("false", radioButton.getAttribute("checked"));
				}
			}

			TestUtils.scrollDown(driver);

			// Make sure JSON is still the same
			validateJSON();
	  } catch (Exception e) {
	      TestUtils.markBrowserstackTestResult(driver, isUsingBrowserstack(), false,
	    		  "Exception " + e.getClass().getSimpleName() + " occurs! See log for details.");
	      throw e;
	  } catch (AssertionError e) {
		  TestUtils.markBrowserstackTestResult(driver, isUsingBrowserstack(), false,
				  "Assertion Error: '" + e.getMessage() + "' occurs! See log for details.");
	      throw e;
	  }
	  // if we make it to the end with no exceptions, that means we passed!
	  TestUtils.markBrowserstackTestResult(driver, isUsingBrowserstack(), true, "Android - TestStagingForm.testSwitchTab() passed!");
  }

  //TODO: switch via menu on the left
  @AfterClass
  public static void tearDown() {
	 AndroidTest.tearDown();
  }
}