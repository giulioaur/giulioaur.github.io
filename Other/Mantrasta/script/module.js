class Module {
    constructor(name, field) {
        this.name = name;
        /** @type {Array<Role>} */
        this.roles = field.p.concat(field.d).concat(field.c).concat(field.a)
                    .filter(fieldPos => fieldPos.role)
                    .map(fieldPos => new Role(fieldPos.role));
        this.fieldD = field.d.map(position => new FieldPosition(position.space, position.role));
        this.fieldC = field.c.map(position => new FieldPosition(position.space, position.role));
        this.fieldA = field.a.map(position => new FieldPosition(position.space, position.role));
    }

    deserialize(jsonObject) {
        this.name = jsonObject.name;
        this.roles = jsonObject.roles.map(jsonRole => new Role(jsonRole.subRoles.join(';')));
        return this;
    }
}

class FieldPosition {
    constructor(space, role) {
        this.space = space;
        this.role = role ? new Role(role) : null;
    }
}

class ModuleCompatibilty {
    constructor(module, rolesAvailability, playersPerRole) {
        /** @type { Module } */
        this.module = module;
        /** @type { Array<Role> } */
        this.missingRoles = rolesAvailability
            .map((value, i) => new Role(this.module.roles[i].explicit))
            .filter((value, i) => rolesAvailability[i] == 0);
        this.index = this.missingRoles.length;
        /** @type { Array<Array<Player>>} */
        this.playersPerRole = playersPerRole;
    }
}

class Role {
    constructor(string) {
        this.explicit = string;
        /** @type { Array<String> } */
        this.subRoles = string.split(';').map(role => makeRole(role));
    }

    /**
     * @param {Role} role Check if the role has any overlapping subroles.
     * @returns {bool} True if the two roles overlap. 
     */
    overlap(role) {
        return this.subRoles.filter(subRole => role.subRoles.indexOf(subRole) >= 0).length > 0;
    }
}