import { BuidlerPluginError } from "@nomiclabs/buidler/plugins";
import { SolcConfig } from "@nomiclabs/buidler/types";

import { EtherscanBuidlerEnvironment } from "../index";

export default class EtherscanVerifyContractRequest {
  // for that weird etherscan library props
  [key: string]: any;
  public readonly module: string = "contract";
  public readonly action: string = "verify";
  public readonly addressHash: string;
  public readonly contractSourceCode: string;
  public readonly name: string;
  public readonly compilerVersion: string;
  public readonly optimization: number;
  public readonly optimizationRuns: number;
  public readonly constructorArguments: string;

  constructor(
    etherscanConfig: EtherscanBuidlerEnvironment,
    solcConfig: SolcConfig,
    contractName: string,
    address: string,
    libraries: string,
    source: string,
    constructorArguments: string
  ) {
    this.addressHash = address;
    this.contractSourceCode = source;
    this.name = contractName;
    this.compilerVersion = solcConfig.fullVersion;
    this.optimization = solcConfig.optimizer.enabled;
    this.optimizationRuns = solcConfig.optimizer.runs;
    this.constructorArguments = constructorArguments;
    this.setLibraries(libraries);
  }

  public serialize(): string {
    return JSON.stringify(this);
  }

  private setLibraries(libraries: string) {
    let i: number = 1;
    let parsedLibraries: { [key: string]: string } = {};
    try {
      if (libraries) {
        parsedLibraries = JSON.parse(libraries);
      }
    } catch (e) {
      throw new BuidlerPluginError(
        "Failed to parse libraries. Reason: " + e.message
      );
    }
    for (const libraryName in parsedLibraries) {
      if (parsedLibraries.hasOwnProperty(libraryName)) {
        this[`library${i}Name`] = libraryName;
        this[`library${i}Address`] = parsedLibraries[libraryName];
        i++;
        if (i >= 10) {
          break;
        }
      }
    }
  }
}
