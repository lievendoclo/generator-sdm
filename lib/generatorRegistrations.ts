import { GitHubRepoRef } from "@atomist/automation-client";
import { GeneratorRegistration } from "@atomist/sdm";
import {
    inferSpringStructureAndRenameTransform,
    inferStructureAndMovePackageTransform,
    ReplaceReadmeTitle,
    SpringProjectCreationParameterDefinitions,
    updatePomTransform,
} from "@atomist/sdm-pack-spring";
import { JavaProjectCreationParameterDefinitions } from "@atomist/sdm-pack-spring/lib/java/generate/JavaProjectCreationParameters";

export interface GeneratorInfo {
    stackInfo: string;
}

export const BuiltInGeneratorRegistrations: Array<GeneratorRegistration<any> & GeneratorInfo> = [
    {
        name: "Spring Boot REST (Kotlin)",
        description: "Spring Boot REST application with Kotlin",
        intent: "generate spring-boot-rest-kotlin",
        parameters: JavaProjectCreationParameterDefinitions,
        startingPoint: GitHubRepoRef.from({ owner: "atomist-seeds", repo: "kotlin-rest", branch: "master" }),
        transform: [
            ReplaceReadmeTitle,
            updatePomTransform,
            inferStructureAndMovePackageTransform,
        ],
        tags: ["kotlin", "boot", "spring", "mvc", "spring-mvc", "rest", "maven"],
        stackInfo: "Language: Kotlin  \nTechnologies used: Spring MVC",
    },
    {
        name: "Spring Boot REST (Java)",
        description: "Spring Boot REST application with Java",
        intent: "generate spring-boot-rest",
        parameters: SpringProjectCreationParameterDefinitions,
        startingPoint: GitHubRepoRef.from({ owner: "atomist-seeds", repo: "spring-rest", branch: "master" }),
        transform: [
            updatePomTransform,
            inferStructureAndMovePackageTransform,
            inferSpringStructureAndRenameTransform,
        ],
        tags: ["spring", "boot", "mvc", "spring-mvc", "rest", "maven"],
        stackInfo: "Language: Java  \nTechnologies used: Spring MVC",
    },
    {
        name: "Spring Boot REST+JPA 3-tier (Java)",
        description: "3-tier application with Spring Boot",
        intent: "generate spring-boot-rest-jpa",
        parameters: SpringProjectCreationParameterDefinitions,
        startingPoint: GitHubRepoRef.from({ owner: "lievendoclo", repo: "spring-boot-rest-jpa", branch: "master" }),
        transform: [
            ReplaceReadmeTitle,
            updatePomTransform,
            inferStructureAndMovePackageTransform,
            inferSpringStructureAndRenameTransform,
        ],
        tags: ["spring", "boot", "mvc", "rest", "jpa", "spring-mvc", "spring-boot-jpa", "3tier"],
        stackInfo: "Language: Java  \nTechnologies used: Quarkus, JPA",
    },
    {
        name: "Quarkus REST (Java)",
        description: "REST application with Quarkus",
        intent: "generate quarkus-rest",
        parameters: JavaProjectCreationParameterDefinitions,
        startingPoint: GitHubRepoRef.from({ owner: "atomist-seeds", repo: "quarkus-rest", branch: "master" }),
        transform: [
            updatePomTransform,
            inferStructureAndMovePackageTransform,
        ],
        tags: ["quarkus", "rest"],
        stackInfo: "Language: Java  \nTechnologies used: Quarkus",
    },
    {
        name: "Quarkus REST+JPA 3-tier (Java)",
        description: "3-tier application with Quarkus",
        intent: "generate quarkus-rest-jpa",
        parameters: JavaProjectCreationParameterDefinitions,
        startingPoint: GitHubRepoRef.from({ owner: "lievendoclo", repo: "quarkus-rest-jpa", branch: "master" }),
        transform: [
            updatePomTransform,
            inferStructureAndMovePackageTransform,
        ],
        tags: ["quarkus", "rest", "jpa", "3tier"],
        stackInfo: "Language: Java  \nTechnologies used: Quarkus, JPA",
    },
    {
        name: "Micronaut REST (Java)",
        description: "REST application with Micronaut",
        intent: "generate quarkus-rest",
        parameters: JavaProjectCreationParameterDefinitions,
        startingPoint: GitHubRepoRef.from({ owner: "atomist-seeds", repo: "micronaut-rest", branch: "master" }),
        transform: [
            updatePomTransform,
            inferStructureAndMovePackageTransform,
        ],
        tags: ["micronaut", "rest"],
        stackInfo: "Language: Java  \nTechnologies used: Micronaut",
    },
];
