package ruegg.andre;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;

public class OrbitalDiagram {

	public LinkedHashMap<String, Integer> orbital;

	String[] blocks = { "s", "p", "d", "f" };

	String[] energyLevels = { "1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p",
			"7s", "5f", "6d", "7p", "8s", "6f", "7d", "8p", "9s", "7f", "8d", "9p", "10s", "8f", "9d", "10p", "11s"};

	String[] nobleGasRowEnergies = {"1s2", "2p6", "3p6", "4p6", "5p6", "6p6"};
	String[] nobleGasNames = {"He", "Ne", "Ar", "Kr", "Xe", "Rn"};
	
	String currentEnergyLevel = "1s";

	int electrons;

	public boolean priorityFill = false;
	public String priorityEnergyLevel = "";
	public int waitPriorityFill = 0;

	public OrbitalDiagram(int electrons) {
		orbital = new LinkedHashMap<String, Integer>();
		this.electrons = electrons;
	}

	public void putElectronInCurrentOrbital() {
		if (!priorityFill) {
			String currentRowEnergy = currentEnergyLevel + customGet(currentEnergyLevel);
			
			basicElectronAdd();
			
			checkEnergyLevel();
			currentRowEnergy = currentEnergyLevel + customGet(currentEnergyLevel);
			
			String[] borrowInformation = getBorrowingInformation(currentRowEnergy);
			if (borrowInformation != null) {
				int borrowCount = Integer.parseInt(borrowInformation[0]);
				String borrowEnergyLevel = borrowInformation[1];
				boolean hasPriorityFill = Boolean.parseBoolean(borrowInformation[2]);
				orbital.put(borrowEnergyLevel, customGet(borrowEnergyLevel) - 1);
				orbital.put(currentEnergyLevel, customGet(currentEnergyLevel) + 1);
				borrowCount = borrowCount - 1;
				if (hasPriorityFill) {
					priorityFill = true;
					priorityEnergyLevel = borrowEnergyLevel;
					waitPriorityFill = borrowCount;
				}
			}
		}else{
			if(waitPriorityFill == 0){
				orbital.put(priorityEnergyLevel, (customGet(priorityEnergyLevel) + 1));
				if(customGet(priorityEnergyLevel) == 2){
					priorityFill = false;
					priorityEnergyLevel = "";
					waitPriorityFill = 0;
				}
			}else{
				waitPriorityFill = waitPriorityFill-1;
				basicElectronAdd();
			}
		}
	}

	public String getNobleGasConfiguration(String fullConfiguration){
		String nobleGasConfiguration = "Non Existant";
		for(int x = (nobleGasRowEnergies.length-1); x != -1;x--){
			String currentNobleGasRowEnergy = nobleGasRowEnergies[x];
			if(fullConfiguration.contains(currentNobleGasRowEnergy)){
				nobleGasConfiguration = "[" + nobleGasNames[x] + "] " + fullConfiguration.substring(fullConfiguration.indexOf(currentNobleGasRowEnergy)+3, fullConfiguration.length()); 
				break;
			}

		}
		return nobleGasConfiguration;
	}
	
	public String[] getLazyConfiguration(String[] configuration){
		String lazyConfiguration = "";
		for(int x =0 ; x != configuration.length-1;x++){//For all rowenergies except for the last one
			String currentRowEnergy = configuration[x];
			String block = currentRowEnergy.substring(1, 2);
			int electronCount = Integer.parseInt(currentRowEnergy.substring(2, currentRowEnergy.length()));
			if(electronCount != getMaxElectrons(block)){
				lazyConfiguration = lazyConfiguration + currentRowEnergy;
			}
		}
		lazyConfiguration = lazyConfiguration + configuration[configuration.length-1] + ".";
		lazyConfiguration = lazyConfiguration.substring(0, lazyConfiguration.length()-1);
		return lazyConfiguration.split("\\.");
	}
	
	public void basicElectronAdd(){
		checkEnergyLevel();
		orbital.put(currentEnergyLevel, (customGet(currentEnergyLevel) + 1));
	}
	
	public void checkEnergyLevel(){
		if (customGet(currentEnergyLevel) >= getMaxElectrons(getCurrentBlock())) {
			currentEnergyLevel = getNextEnergyLevel(currentEnergyLevel);
		}
	}
	
	public int customGet(String energyLevel){
		if(orbital.containsKey(energyLevel)){
			return orbital.get(energyLevel);
		}else{
			orbital.put(energyLevel, 0);
			return 0;
		}
	}
	
	public int getCurrentRow() {
		return Integer.parseInt(currentEnergyLevel.substring(0, 1));
	}

	public int getCurrentBlockIndex() {
		return getBlockIndex(currentEnergyLevel.substring(currentEnergyLevel.length() - 1));
	}

	public String getCurrentBlock() {
		return blocks[getCurrentBlockIndex()];
	}

	public String getNextEnergyLevel(String energyLevel) {
		String returning = null;
		for (int x = 0; x != energyLevels.length; x++) {
			if (energyLevels[x].equals(energyLevel)) {
				returning = energyLevels[x + 1];
				break;
			}
		}
		return returning;
	}

	public int getBlockIndex(String block) {
		int returning = 0;
		switch (block) {
		case "s":
			returning = 0;
			break;
		case "p":
			returning = 1;
			break;
		case "d":
			returning = 2;
			break;
		case "f":
			returning = 3;
			break;
		}
		return returning;
	}

	public int getMaxElectrons(String gL) {
		if (gL.equals("s")) {
			return 2;
		} else if (gL.equals("p")) {
			return 6;
		} else if (gL.equals("d")) {
			return 10;
		} else if (gL.equals("f")) {
			return 14;
		} else {
			return 0;
		}
	}

	// Use principle, it can use from others but after it is filled, set the
	// priority to what was used

	public String[] getBorrowingInformation(String rowEnergy) {
		if (rowEnergy.equals("3d4")) {
			String[] borrow = { "1", "4s", "true" };
			return borrow;
		} else if (rowEnergy.equals("3d9")) {
			String[] borrow = { "1", "4s", "true" };
			return borrow;
		} else if (rowEnergy.equals("4d3")) {
			String[] borrow = { "2", "5s", "true" };// True = Set priority back
													// to s after borrowing
			return borrow;
		} else if (rowEnergy.equals("4d6")) {
			String[] borrow = { "2", "5s", "false" };// False = don't set
														// priority back to s
														// after borrowing
			return borrow;
		} else if (rowEnergy.equals("4d9")) {
			String[] borrow = { "1", "5s", "true" };
			return borrow;
		} else {
			return null;
		}
	}

}
