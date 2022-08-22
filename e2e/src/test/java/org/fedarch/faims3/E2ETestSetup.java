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
 * Filename: E2ETest.java
 * Description:
 *   TODO
 */
package org.fedarch.faims3;

import java.util.HashMap;

import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class E2ETestSetup {

	public boolean isLocal;

	protected RemoteWebDriver driver;

	// Newly created observation form's id
	protected String recordId;

	public boolean isUsingBrowserstack() {
		return !isLocal;
	}

	/**
	 * Optional logging options for browserstack
	 * @param caps
	 * @return
	 */
	public void turnOnBrowserstackLogs(DesiredCapabilities caps) {
	    // Log settings to debug
	    caps.setCapability("browserstack.console", "verbose");
	    HashMap networkLogsOptions = new HashMap<>();
	    networkLogsOptions.put("captureContent", Boolean.TRUE);
	    // turn on network logs
	    caps.setCapability("browserstack.networkLogs", "true");
	    caps.setCapability("browserstack.networkLogsOptions", networkLogsOptions);
	}
}
