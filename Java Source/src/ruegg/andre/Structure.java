package ruegg.andre;

import java.util.Arrays;
import java.util.Map.Entry;

public class Structure {

	public void printStructure(String[] information) {
		System.out.println("---------------------------------");
		System.out.println("Element: " + information[0]);
		System.out.println("Abbreviation: " + information[1]);
		System.out.println("Atomic #: " + information[2]);

		int electrons = Integer.parseInt(information[2]);
		OrbitalDiagram ob = new OrbitalDiagram(electrons);
		for (int x = 0; x != electrons; x++) {
			ob.putElectronInCurrentOrbital();
		}
		String fullConfiguration = "";
		String splitConfiguration = "";
		for (Entry<String, Integer> e : ob.orbital.entrySet()) {
			if (e.getValue() > 0) {
				fullConfiguration = fullConfiguration + e.getKey() + e.getValue();
				splitConfiguration = splitConfiguration + e.getKey() + e.getValue() + ".";
			}
		}
		String[] configuration = (splitConfiguration.substring(0, splitConfiguration.length() - 1)).split("\\.");
		System.out.println("Full Configuration: " + fullConfiguration);
		System.out.println("Noble Gas Configuration: " + ob.getNobleGasConfiguration(fullConfiguration));
		System.out.println("Lazy Configuration: " + getStringFromArray(ob.getLazyConfiguration(configuration)));
	}
	
	public int getAtomicNumberThroughLazyConfig(String[] config){
		int atomicnumber = 0;
		OrbitalDiagram ob = new OrbitalDiagram(118);
		for (int x = 0; x != 118; x++) {
			ob.putElectronInCurrentOrbital();
			String fullConfiguration = "";
			String splitConfiguration = "";
			for (Entry<String, Integer> e : ob.orbital.entrySet()) {
				if (e.getValue() > 0) {
					fullConfiguration = fullConfiguration + e.getKey() + e.getValue();
					splitConfiguration = splitConfiguration + e.getKey() + e.getValue() + ".";
				}
			}
			String[] configuration = (splitConfiguration.substring(0, splitConfiguration.length() - 1)).split("\\.");
			String[] lazyConfig = ob.getLazyConfiguration(configuration);
			if (Arrays.asList(config).containsAll(Arrays.asList(lazyConfig))) {
				atomicnumber = x+1;
			}
		}
		return atomicnumber;
	}
	
	public int getAtomicNumberThroughFullConfig(String[] config) {
		int atomicnumber = 0;
		OrbitalDiagram ob = new OrbitalDiagram(118);
		for (int x = 0; x != 118; x++) {

			ob.putElectronInCurrentOrbital();
			String fullConfiguration = "";
			String splitConfiguration = "";
			for (Entry<String, Integer> e : ob.orbital.entrySet()) {
				if (e.getValue() > 0) {
					fullConfiguration = fullConfiguration + e.getKey() + e.getValue();
					splitConfiguration = splitConfiguration + e.getKey() + e.getValue() + ".";
				}
			}
			String[] configuration = (splitConfiguration.substring(0, splitConfiguration.length() - 1)).split("\\.");
			if (Arrays.asList(config).containsAll(Arrays.asList(configuration))) {
					atomicnumber = x+1;
			}
		}
		return atomicnumber;
	}
	
	public String getStringFromArray(String[] a){
	   String out ="";
	   for(String str: a)
	        out=out+str;
	   return out;
	}
}
