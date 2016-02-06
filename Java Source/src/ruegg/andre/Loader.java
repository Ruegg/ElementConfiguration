package ruegg.andre;

import java.util.List;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

public class Loader {

	public ClassLoader cl = this.getClass().getClassLoader();

	public List<String[]> getElementInformation() throws IOException {
		List<String[]> information = new ArrayList<String[]>();

		BufferedReader in = new BufferedReader(new InputStreamReader(cl.getResource("elements.txt").openStream()));
		String inputLine;

		while ((inputLine = in.readLine()) != null) {
			information.add(inputLine.split("-"));
		}
		in.close();
		return information;
	}
}
