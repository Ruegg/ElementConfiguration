package ruegg.andre;

import java.io.IOException;
import java.util.List;
import java.util.Scanner;

public class Main {

	public static List<String[]> elementInformation;
	
	public static Structure structure;
	
	public static void main(String[] args){
		Loader l = new Loader();
		try {
			elementInformation = l.getElementInformation();
		} catch (IOException e) {
			System.out.println("Error loading information..");
			System.out.println(e.getMessage());
			return;
		}
		structure = new Structure();
		System.out.println("INPUT OPTIONS: (Atomic Number/Electron amount, Element name, Element abbreviation, Full Configuration, Lazy Configuration)");
		input();
	}
	
	public static void input(){
		Scanner s = new Scanner(System.in);
		System.out.println("-> ");
		String input = s.nextLine();
		if(isInteger(input)){
			String[] information = getInformation(input, 2);
			if(information != null){
				structure.printStructure(information);
			}else{
				System.out.println("Invalid atomic number.");
			}
		}else if(input.length() <= 3 && input.matches(".*\\d+.*") == false){
			String[] information = getInformation(input, 1);
			if(information != null){
				structure.printStructure(information);
			}else{
				System.out.println("Invalid abbreviation.");
			}
		}else if(input.matches(".*\\d+.*")){
			if(input.startsWith("1s2")){
				int atomicNumber = structure.getAtomicNumberThroughFullConfig(input.split(" "));
				if(atomicNumber != 0){
					structure.printStructure(getInformation("" + atomicNumber, 2));
				}else{
					System.out.println("Bad electron full configuration");
				}
			}else{
				int atomicNumber = structure.getAtomicNumberThroughLazyConfig(input.split(" "));
				if(atomicNumber != 0){
					structure.printStructure(getInformation("" + atomicNumber, 2));
				}else{
					System.out.println("Bad electron lazy configuration");
				}
			}
		}else{
			String[] information = getInformation(input, 0);
			if(information != null){
				structure.printStructure(information);
			}else{
				System.out.println("Invalid element name.");
			}
		}
		input();
	}
	
	public static String[] getInformation(String lookup, int length){
		String[] found = null;
		for(String[] s : elementInformation){
			if(s[length].equalsIgnoreCase(lookup)){
				found = s;
			}
		}
		return found;
	}
	
	public static boolean isInteger(String s) {
	    return isInteger(s,10);
	}

	public static boolean isInteger(String s, int radix) {
	    if(s.isEmpty()) return false;
	    for(int i = 0; i < s.length(); i++) {
	        if(i == 0 && s.charAt(i) == '-') {
	            if(s.length() == 1) return false;
	            else continue;
	        }
	        if(Character.digit(s.charAt(i),radix) < 0) return false;
	    }
	    return true;
	}
}
