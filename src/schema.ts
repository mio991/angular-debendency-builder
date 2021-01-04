import { Target } from "@angular-devkit/architect";
import { JsonObject, isJsonObject } from "@angular-devkit/core";

export interface BuildOptions{
    dependsOn: Target[];
    exec: Target;
}

function isTarget(obj: JsonObject): obj is Target{
    return "project" in obj && "target" in obj;
}

export function readOptions(inputs:JsonObject):BuildOptions {
    if (!("dependsOn" in inputs && Array.isArray(inputs.dependsOn))) {
        throw new Error();
    }
    if (!isJsonObject(inputs.exec) || !isTarget(inputs.exec)) {
        throw new Error();
    }

    return {
        dependsOn: inputs.dependsOn.filter(isJsonObject).filter(isTarget),
        exec: inputs.exec
    };
}