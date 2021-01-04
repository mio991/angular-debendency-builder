import { BuilderOutput, BuilderRun, createBuilder, targetStringFromTarget } from "@angular-devkit/architect";
import { readOptions } from "./schema";

const runingBuilds = new Map<string, BuilderRun>(); 

export default createBuilder(async (input, context):Promise<BuilderOutput> => {
    const options = readOptions(input);
    
    for (const dependencie of options.dependsOn) {
        context.logger.info(`Build Dependencie: ${dependencie.project}:${dependencie.target}`);

        const build = runingBuilds.get(targetStringFromTarget(dependencie)) ?? await context.scheduleTarget(dependencie);

        runingBuilds.set(targetStringFromTarget(dependencie), build);

        const result = await build.result;

        if (!result.success) {
            return result;
        }
    }

    const build = await context.scheduleTarget({
        ...context.target ?? {},
        ...options.exec
    });

    return await build.result
})