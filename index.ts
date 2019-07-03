/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    actionableButton,
    CommandHandlerRegistration,
    GeneratorRegistration,
    ParametersDefinition,
} from "@atomist/sdm";
import { configure } from "@atomist/sdm-core";
import { toArray } from "@atomist/sdm-core/lib/util/misc/array";
import {
    Attachment,
    SlackMessage,
} from "@atomist/slack-messages";
import {
    BuiltInGeneratorRegistrations,
    GeneratorInfo,
} from "./lib/generatorRegistrations";

interface SearchParameters {
    tags: string;
}

const SearchParametersDefinition: ParametersDefinition<SearchParameters> = {
    tags: { required: true, description: "Search tags" },
};

function generateSlackMessage(generators: Array<GeneratorRegistration<any> & GeneratorInfo>): SlackMessage {
    const slackify = require("slackify-markdown");
    if (generators.length > 0) {
        return {
            text: "The following generators are available",
            attachments: generators.map<Attachment>(reg => {
                const fallback = `${BuiltInGeneratorRegistrations.map(r =>
                    `* **${r.name}**  \nCommand: \`${r.intent}\`  \n${r.description}`).join("\n")
                    }`;
                return {
                    title: reg.name,
                    // tslint:disable-next-line:max-line-length
                    text: slackify(`Command: \`${reg.intent}\`  \n${reg.stackInfo}  \nTags: ${toArray(reg.tags).map(tag => `\`${tag}\``).join(", ")}`),
                    fallback: slackify(fallback),
                    actions: [actionableButton({text: "Generate this project"}, reg)],
                };
            }),
        };
    } else {
        return {
            text: slackify("Sorry, we don't have any generators yet for this combination of technologies.\n" +
                "Feel free to ask us on Twitter [@atomist](https://twitter.com/atomist) to provide one. " +
                "You can also make your own and let us know! We'll incorporate it in our list. "),
        };
    }
}

export const configuration = configure(async sdm => {
    BuiltInGeneratorRegistrations.forEach(reg => sdm.addGeneratorCommand(reg));

    const ListGenerators: CommandHandlerRegistration = {
        name: "list-generators",
        intent: "list generators",
        autoSubmit: true,
        listener: async ci => {
            const slackMessage = generateSlackMessage(BuiltInGeneratorRegistrations);
            ci.addressChannels(slackMessage);
        },
    };

    const SearchGenerators: CommandHandlerRegistration<SearchParameters> = {
        name: "search-generators",
        intent: "search generators",
        parameters: SearchParametersDefinition,
        autoSubmit: true,
        listener: async ci => {
            const filteredRegistrations = BuiltInGeneratorRegistrations.filter(reg => {
                const tags = ci.parameters.tags.split(/[, ]/).filter(tag => !!tag && tag.length > 0);
                return tags.every(val => toArray(reg.tags).includes(val));
            });
            const slackMessage = generateSlackMessage(filteredRegistrations);
            ci.addressChannels(slackMessage);
        },
    };

    sdm.addCommand(ListGenerators);
    sdm.addCommand(SearchGenerators);
}, {
    name: "generator-sdm",
});
