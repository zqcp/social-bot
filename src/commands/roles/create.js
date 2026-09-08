const{
PermissionFlagsBits,
Constants
}=require("discord.js");

constglobalEmbeds=
require("../../embeds/general/global");

constroleEmbeds=
require("../../embeds/general/roles");

//=========================
//COMMAND
//=========================

module.exports={

name:"rolecreate",

aliases:["rc"],

asyncexecute(
client,
message,
args
){

//=========================
//GUILDCHECK
//=========================

if(!message.guild){
returnmessage.channel.send({
embeds:[
globalEmbeds.error(
"Thiscommandcanonlybeusedinaserver."
)
]
});
}

//=========================
//USERPERMISSION
//=========================

if(
!message.member.permissions.has(
PermissionFlagsBits.ManageRoles
)
){
returnmessage.channel.send({
embeds:[
globalEmbeds.permission(
message.author,
"ManageRoles"
)
]
});
}

//=========================
//BOTPERMISSIONS
//=========================

constbotMember=
message.guild.members.me;

constrequiredPermissions=[
PermissionFlagsBits.ViewChannel,
PermissionFlagsBits.SendMessages,
PermissionFlagsBits.EmbedLinks,
PermissionFlagsBits.ManageRoles
];

constmissingPermissions=
requiredPermissions.filter(
permission=>
!message.channel
.permissionsFor(botMember)
?.has(permission)
);

if(missingPermissions.length){
constpermissionNames=
missingPermissions.map(
permission=>
Object.entries(
PermissionFlagsBits
).find(
([,value])=>
value===permission
)?.[0]||permission
);

returnmessage.channel.send({
embeds:[
globalEmbeds.botPermission(
message.author,
permissionNames
)
]
});
}

//=========================
//PARSEOPTIONS
//=========================

constoptions={
style:"solid",
colors:[],
icon:null
};

constnameParts=[];

for(letindex=0;index<args.length;index++){

constargument=
args[index];

if(
argument==="--style"||
argument==="-s"
){
options.style=
args[++index]?.toLowerCase();

continue;
}

if(
argument==="--color"||
argument==="-c"
){
constcolor=
args[++index];

if(color){
options.colors.push(
color
);
}

continue;
}

if(
argument==="--colors"
){
constcolors=
args[++index];

if(colors){
options.colors.push(
...colors.split(",")
);
}

continue;
}

if(
argument==="--icon"||
argument==="-i"
){
options.icon=
args[++index];

continue;
}

nameParts.push(
argument
);
}

//=========================
//ROLENAME
//=========================

constroleName=
nameParts.join("").trim();

if(!roleName){
returnmessage.channel.send({
embeds:[
globalEmbeds.missing(
message.author,
"rolename"
)
]
});
}

if(roleName.length>100){
returnmessage.channel.send({
embeds:[
globalEmbeds.invalid(
message.author,
roleName
)
]
});
}

//=========================
//CHECKEXISTINGROLE
//=========================

constexistingRole=
message.guild.roles.cache.find(
role=>
role.name.toLowerCase()===
roleName.toLowerCase()
);

if(existingRole){
returnmessage.channel.send({
embeds:[
globalEmbeds.alreadyExists(
message.author,
roleName
)
]
});
}

//=========================
//VALIDATESTYLE
//=========================

constvalidStyles=[
"solid",
"gradient",
"holographic"
];

if(
!validStyles.includes(
options.style
)
){
returnmessage.channel.send({
embeds:[
roleEmbeds.invalidStyle(
message.author,
options.style
)
]
});
}

//=========================
//VALIDATECOLORS
//=========================

constcolorRegex=
/^#?[0-9a-fA-F]{6}$/;

if(
options.colors.length&&
options.colors.some(
color=>
!colorRegex.test(
color
)
)
){
returnmessage.channel.send({
embeds:[
roleEmbeds.invalidColor(
message.author,
options.colors.join(",")
)
]
});
}

options.colors=
options.colors.map(
color=>
color.startsWith("#")
?color
:`#${color}`
);

//=========================
//STYLECOLORREQUIREMENTS
//=========================

if(
options.style==="gradient"&&
options.colors.length!==2
){
returnmessage.channel.send({
embeds:[
roleEmbeds.invalidColor(
message.author,
"Gradientrequirestwocolors."
)
]
});
}

if(
options.style==="solid"&&
options.colors.length>1
){
returnmessage.channel.send({
embeds:[
roleEmbeds.invalidColor(
message.author,
"Solidrolesonlyuseonecolor."
)
]
});
}

if(
options.style==="holographic"&&
options.colors.length
){
returnmessage.channel.send({
embeds:[
roleEmbeds.invalidColor(
message.author,
"HolographicrolesuseDiscord'sholographiccolors."
)
]
});
}

//=========================
//CREATEROLE
//=========================

try{

constroleOptions={
name:roleName,
reason:
`Createdby${message.author.tag}`
};

//=========================
//ROLESTYLE
//=========================

if(
options.style==="solid"
){

if(
options.colors.length
){
roleOptions.colors={
primaryColor:
options.colors[0]
};
}

}

if(
options.style==="gradient"
){

roleOptions.colors={
primaryColor:
options.colors[0],

secondaryColor:
options.colors[1]
};

}

if(
options.style==="holographic"
){

roleOptions.colors={
primaryColor:
Constants.HolographicStyle.Primary,

secondaryColor:
Constants.HolographicStyle.Secondary,

tertiaryColor:
Constants.HolographicStyle.Tertiary
};

}

//=========================
//CREATE
//=========================

constrole=
awaitmessage.guild.roles.create(
roleOptions
);

//=========================
//ROLEICON
//=========================

if(options.icon){

try{

awaitrole.setIcon(
options.icon,
`Roleiconsetby${message.author.tag}`
);

}catch(error){

console.error(
"RoleIconError:",
error
);

awaitrole.delete(
`Rolecreationrolledbackafterinvalidroleicon`
);

returnmessage.channel.send({
embeds:[
roleEmbeds.invalidIcon(
message.author,
options.icon
)
]
});

}
}

//=========================
//SUCCESS
//=========================

returnmessage.channel.send({
embeds:[
roleEmbeds.createSuccess(
message.author,
role
)
]
});

}catch(error){

console.error(
"RoleCreateError:",
error
);

returnmessage.channel.send({
embeds:[
roleEmbeds.createFailed(
message.author,
roleName
)
]
});

}

}

};
