const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    PermissionFlagsBits
} = require('discord.js');

const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

function isValidUrl(url) {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

client.on('ready', () => {
    console.log(`✅ تم تشغيل البوت بنجاح باسم: ${client.user.tag}`);
});

// ==========================================
// أوامر إنشاء البانلات (Setup Commands)
// ==========================================

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.author.id !== '612634852000530465') return;

    // 1. بانل التكت
    if (message.content === '!setuptickets') {
        const embed = new EmbedBuilder()
            .setTitle(config.texts.ticket_title)
            .setDescription(config.texts.ticket_desc)
            .setColor(config.colors.primary)
            .setFooter({ text: config.texts.ticket_footer });

        if (isValidUrl(config.images.ticket_banner)) embed.setImage(config.images.ticket_banner);

        const ticketOptions = Object.keys(config.ticket_categories || {}).map(key => {
            const cat = config.ticket_categories[key];
            return {
                label: cat.label,
                value: key,
                emoji: cat.emoji || '🎫',
                description: cat.description || ''
            };
        });

        if (ticketOptions.length === 0) {
            return message.reply('❌ لم يتم العثور على أقسام للتكت في ملف config.json!');
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('اختر قسم التكت | Select Category')
            .addOptions(ticketOptions);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(select)] });
    }

    // 2. بانل الاقتراحات العامة
    if (message.content === '!setup-suggestions') {
        const embed = new EmbedBuilder()
            .setTitle(config.texts.suggestion_title)
            .setDescription(config.texts.suggestion_desc)
            .setColor(config.colors.danger);

        if (isValidUrl(config.images.suggestion_banner)) embed.setImage(config.images.suggestion_banner);

        const btn = new ButtonBuilder()
            .setCustomId('btn_suggestion')
            .setLabel('Suggestion')
            .setEmoji('💡')
            .setStyle(ButtonStyle.Success);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }

    // 2.5. بانل اقتراحات ה-Streamer (جديد 🎥)
    if (message.content === '!setup-streamer-suggestions') {
        const embed = new EmbedBuilder()
            .setTitle('اقتراحات الستريمرز | Streamer Suggestions 🎬')
            .setDescription('اضغط على الزر أدناه لتقديم اقتراح خاص بقسم الستريمرز')
            .setColor(config.colors?.primary || '#2b2d31');

        if (isValidUrl(config.images?.streamer_suggestion_banner || config.images?.suggestion_banner)) {
            embed.setImage(config.images?.streamer_suggestion_banner || config.images?.suggestion_banner);
        }

        const btn = new ButtonBuilder()
            .setCustomId('btn_streamer_suggestion')
            .setLabel('تقديم اقتراح ستريمر')
            .setEmoji('🎥')
            .setStyle(ButtonStyle.Primary);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }

    // 3. بانل طلب الرتبة العامة
    if (message.content === '!setup-role-request') {
        const embed = new EmbedBuilder()
            .setTitle('طلب رتبة | Role Request')
            .setDescription('اضغط على الزر أدناه لتقديم طلب الحصول على رتبة')
            .setColor(config.colors.primary);

        if (isValidUrl(config.images.role_request_banner)) embed.setImage(config.images.role_request_banner);

        const btn = new ButtonBuilder()
            .setCustomId('btn_role_request')
            .setLabel('تقديم طلب')
            .setStyle(ButtonStyle.Primary);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }

    // 3.5 بانل طلب رتبة Streamer
    if (message.content === '!setup-streamer-request') {
        const embed = new EmbedBuilder()
            .setTitle('طلب رتبة صانع محتوى | Streamer Request 🎥')
            .setDescription('اضغط على الزر أدناه للتقديم على رتبة Streamer')
            .setColor(config.colors.primary);

        if (isValidUrl(config.images.streamer_banner || config.images.role_request_banner)) {
            embed.setImage(config.images.streamer_banner || config.images.role_request_banner);
        }

        const btn = new ButtonBuilder()
            .setCustomId('btn_streamer_request')
            .setLabel('تقديم طلب Streamer')
            .setEmoji('🎬')
            .setStyle(ButtonStyle.Primary);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }

    // 4. بانل التعميمات
    if (message.content === '!setup-announcement') {
        const embed = new EmbedBuilder()
            .setTitle('announcement')
            .setDescription('اضغط على الزر أدناه لإنشاء تعميم جديد')
            .setColor(config.colors.success);

        if (isValidUrl(config.images.announcement_banner)) embed.setImage(config.images.announcement_banner);

        const btn = new ButtonBuilder()
            .setCustomId('btn_create_announcement')
            .setLabel('announcement')
            .setEmoji('📢')
            .setStyle(ButtonStyle.Secondary);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }

    // 5. بانل القوانين
    if (message.content === '!setup-rules') {
        const embed = new EmbedBuilder()
            .setTitle('EMS Family Rules')
            .setColor(config.colors?.primary || '#2b2d31');

        if (isValidUrl(config.images?.rules_banner)) embed.setImage(config.images.rules_banner);

        const select = new StringSelectMenuBuilder()
            .setCustomId('rules_select')
            .setPlaceholder('اختر قسم القوانين')
            .addOptions([
                { label: 'EMS Family Rules', value: 'rules_server', emoji: '📜' }
            ]);

        await message.channel.send({
            content: '@everyone',
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(select)]
        });
    }

    // 6. بانل الاستدعاء
    if (message.content === '!setup-callup') {
        const embed = new EmbedBuilder()
            .setTitle(config.texts.callup_title)
            .setDescription(config.texts.callup_desc)
            .setColor(config.colors.danger);

        if (isValidUrl(config.images.callup_banner)) embed.setImage(config.images.callup_banner);

        const btn = new ButtonBuilder()
            .setCustomId('btn_start_callup')
            .setLabel('بدء الاستدعاء')
            .setStyle(ButtonStyle.Danger);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }

    // 7. بانل إرسال رسائل الخاص للأعضاء
    if (message.content === '!setup-dm') {
        const embed = new EmbedBuilder()
            .setTitle('لوحة إرسال رسائل للخاص | Direct Message Broadcaster')
            .setDescription('اضغط على الزر أدناه لإرسال رسالة خاصة لجميع أعضاء السيرفر')
            .setColor(config.colors?.primary || '#2b2d31');

        if (isValidUrl(config.images?.dm_banner)) embed.setImage(config.images.dm_banner);

        const btn = new ButtonBuilder()
            .setCustomId('btn_start_dm_broadcast')
            .setLabel('إرسال رسالة خاصة')
            .setEmoji('📩')
            .setStyle(ButtonStyle.Primary);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
    }
});

// ==========================================
// التفاعلات (Interactions)
// ==========================================

client.on('interactionCreate', async (interaction) => {

    // --- أ) التكتات ---
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
        const type = interaction.values[0];

        const modal = new ModalBuilder()
            .setCustomId(`modal_ticket_${type}`)
            .setTitle('معلومات التذكرة');

        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('ticket_q1').setLabel('اطرح موضوعك').setStyle(TextInputStyle.Paragraph).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('ticket_q2').setLabel('ارفاق تصوير في حال الحاجة').setStyle(TextInputStyle.Short).setRequired(true))
        );

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_ticket_')) {
        const typeKey = interaction.customId.replace('modal_ticket_', '');
        const categoryData = config.ticket_categories?.[typeKey];
        const categoryLabel = categoryData ? categoryData.label : typeKey;

        const q1 = interaction.fields.getTextInputValue('ticket_q1');
        const q2 = interaction.fields.getTextInputValue('ticket_q2');

        await interaction.reply({ content: 'جاري إنشاء التذكرة...', ephemeral: true });

        const member = interaction.member;
        const joinedDays = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24));
        const createdMonths = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24 * 30));

        const channel = await interaction.guild.channels.create({
            name: `ticket-${member.user.username}`,
            parent: config.bot.category_ticket_id || null,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle('تم فتح التذكرة')
            .setDescription(
                `**Member Info | معلومات العضو**\n` +
                `• **Joined Server:** ${joinedDays} days ago\n` +
                `• **Account Created:** ${createdMonths} months ago\n` +
                `• **Member:** <@${member.id}>\n` +
                `• **Username:** ${member.user.username}\n\n` +
                `**Ticket Info | معلومات التذكرة**\n` +
                `• **Ticket Type:** ${categoryLabel}\n` +
                `• **Status:** Open\n\n` +
                `📌 **ما هي مشكلتك؟**\n${q1}\n\n` +
                `📌 **عندك تصوير؟**\n${q2}`
            )
            .setColor(config.colors.danger)
            .setFooter({ text: `${config.texts.ticket_footer} •${new Date().toLocaleString()}` });

        if (isValidUrl(config.images.ticket_inner)) embed.setImage(config.images.ticket_inner);

        const btnClose = new ButtonBuilder().setCustomId('btn_close_ticket').setLabel('إغلاق التذكرة').setEmoji('🔒').setStyle(ButtonStyle.Danger);
        const btnAdmin = new ButtonBuilder().setCustomId('btn_admin_panel').setLabel('لوحة تحكم الإدارة').setEmoji('🛡️').setStyle(ButtonStyle.Primary);

        await channel.send({ content: `<@${member.id}>`, embeds: [embed], components: [new ActionRowBuilder().addComponents(btnClose, btnAdmin)] });
        await interaction.editReply({ content: `تم فتح تذكرتك بنجاح: ${channel}`, ephemeral: true });
    }

    // --- إغلاق التذكرة ---
    if (interaction.isButton() && interaction.customId === 'btn_close_ticket') {
        await interaction.reply('🔒 سيتم إغلاق التذكرة وإرسال سجل السجل (Log) خلال 5 ثوانٍ...');

        const ticketOwner = interaction.channel.permissionOverwrites.cache.find(p => p.type === 1 && p.id !== interaction.guild.id);
        const ownerPing = ticketOwner ? `<@${ticketOwner.id}>` : 'غير معروف';

        const logChannelId = config.bot.ticket_log_channel_id || config.bot.log_channel_id;
        const logChannel = interaction.guild.channels.cache.get(logChannelId);

        if (logChannel) {
            const closeLogEmbed = new EmbedBuilder()
                .setTitle('🔒 تم إغلاق تذكرة')
                .setColor(config.colors.danger)
                .addFields(
                    { name: '📁 اسم القناة', value: `\`${interaction.channel.name}\``, inline: true },
                    { name: '👤 صاحب التكت', value: ownerPing, inline: true },
                    { name: '🛠️ تم إغلاقها بواسطة', value: `<@${interaction.user.id}>`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Ticket ID: ${interaction.channel.id}` });

            await logChannel.send({ embeds: [closeLogEmbed] }).catch(() => {});
        }

        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }

    if (interaction.isButton() && interaction.customId === 'btn_admin_panel') {
        const select = new StringSelectMenuBuilder()
            .setCustomId('admin_ticket_actions')
            .setPlaceholder('اختر إجراء إداري')
            .addOptions([
                { label: 'استلام التكت', value: 'claim_ticket', emoji: '✅' },
                { label: 'تنبيه عضو', value: 'warn_member', emoji: '🔔' },
                { label: 'إضافة عضو', value: 'add_member', emoji: '➕' }
            ]);

        await interaction.reply({ content: 'خيارات التحكم بالإدارة:', components: [new ActionRowBuilder().addComponents(select)], ephemeral: true });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'admin_ticket_actions') {
        const action = interaction.values[0];

        if (action === 'claim_ticket') {
            const ticketOwner = interaction.channel.permissionOverwrites.cache.find(p => p.type === 1 && p.id !== interaction.guild.id);
            const ownerPing = ticketOwner ? `<@${ticketOwner.id}>` : '';
            
            await interaction.channel.send(`• أهلاً ${ownerPing} ! أنا <@${interaction.user.id}> هنا لخدمتك`);
            await interaction.reply({ content: 'تم استلام التذكرة بنجاح.', ephemeral: true });

        } else if (action === 'warn_member') {
            const ticketOwner = interaction.channel.permissionOverwrites.cache.find(p => p.type === 1 && p.id !== interaction.guild.id);
            if (ticketOwner) {
                const user = await interaction.guild.members.fetch(ticketOwner.id).catch(() => null);
                if (user) {
                    const iconUrl = interaction.guild.iconURL() || '';
                    const warnEmbed = new EmbedBuilder()
                        .setTitle('تذكير تذكرة')
                        .setDescription(`**${interaction.guild.name}** نحن بانتظار ردك في التذكره ${interaction.channel} في سيرفر .\nسيتم إغلاق التذكره تلقائياً بعد 12 ساعة في حال عدم الرد`)
                        .setColor('#093a5b')
                        .setTimestamp();

                    if (isValidUrl(iconUrl)) warnEmbed.setThumbnail(iconUrl);

                    await user.send({ embeds: [warnEmbed] }).catch(() => {});
                    await interaction.reply({ content: 'تم إرسال التذكير بنجاح لصاحب التذكرة!', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'لم يتم العثور على صاحب التذكرة!', ephemeral: true });
            }
        } else if (action === 'add_member') {
            await interaction.reply({ content: 'اكتب أيدي العضو المراد إضافته في الشات.', ephemeral: true });
        }
    }

    // --- ب) الاقتراحات العامة ---
    if (interaction.isButton() && interaction.customId === 'btn_suggestion') {
        const modal = new ModalBuilder().setCustomId('modal_suggestion').setTitle('تقديم اقتراح');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('sug_text').setLabel('اكتب اقتراحك هنا').setStyle(TextInputStyle.Paragraph).setRequired(true)));
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_suggestion') {
        const sugText = interaction.fields.getTextInputValue('sug_text');

        const embed = new EmbedBuilder()
            .setTitle('اقتراح جديد 💡')
            .setDescription(`${sugText}\n\n**صاحب الاقتراح**\n<@${interaction.user.id}>`)
            .setColor(config.colors.primary)
            .setFooter({ text: `Today at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` });

        const msg = await interaction.channel.send({ embeds: [embed] });
        await msg.react('👍');
        await msg.react('👎');

        await interaction.reply({ content: 'تم إرسال اقتراحك بنجاح!', ephemeral: true });
    }

    // --- ب.2) اقتراحات الستريمر المستقلة (جديد 🎬) ---
    if (interaction.isButton() && interaction.customId === 'btn_streamer_suggestion') {
        const modal = new ModalBuilder()
            .setCustomId('modal_streamer_suggestion')
            .setTitle('تقديم اقتراح Streamer');

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('streamer_sug_text')
                    .setLabel('اكتب اقتراحك الخاص بالستريم هنا')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            )
        );

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_streamer_suggestion') {
        const sugText = interaction.fields.getTextInputValue('streamer_sug_text');

        const embed = new EmbedBuilder()
            .setTitle('🎬 اقتراح ستريمر جديد')
            .setDescription(`${sugText}\n\n**صاحب الاقتراح:** <@${interaction.user.id}> (\`${interaction.user.id}\`)`)
            .setColor(config.colors?.primary || '#2b2d31')
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}` });

        // تحديد الروم الخاص باقتراحات الستريمر، وإذا لم يوجد يُرسل في نفس الروم
        const targetChannelId = config.bot.streamer_suggestion_channel_id;
        const targetChannel = interaction.guild.channels.cache.get(targetChannelId) || interaction.channel;

        const msg = await targetChannel.send({ embeds: [embed] });
        await msg.react('👍');
        await msg.react('👎');

        await interaction.reply({ content: `✅ تم إرسال اقتراحك بنجاح إلى روم <#${targetChannel.id}>!`, ephemeral: true });
    }

    // --- ج) طلب الرتب العامة ---
    if (interaction.isButton() && interaction.customId === 'btn_role_request') {
        const modal = new ModalBuilder().setCustomId('modal_role_req').setTitle('طلب رتبة');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('role_name').setLabel('رتبتك المطلوبة').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('proof_url').setLabel('رابط صورة إثباتية').setStyle(TextInputStyle.Short).setRequired(true))
        );
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_role_req') {
        const roleName = interaction.fields.getTextInputValue('role_name');
        const proofUrl = interaction.fields.getTextInputValue('proof_url');

        const embed = new EmbedBuilder()
            .setTitle('طلب رتبة جديد 🎖️')
            .addFields(
                { name: 'العضو', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'الرتبة المطلوبة', value: roleName, inline: true }
            )
            .setColor(config.colors.warning)
            .setTimestamp();

        if (isValidUrl(proofUrl)) embed.setImage(proofUrl);

        const targetChannel = interaction.guild.channels.cache.get(config.bot.role_claim_channel_id) || interaction.channel;
        await targetChannel.send({ embeds: [embed] });

        await interaction.reply({ content: 'تم إرسال طلبك بنجاح لوج اللوق للإدارة!', ephemeral: true });
    }

    // --- ج.2) طلب رتبة Streamer ---
    if (interaction.isButton() && interaction.customId === 'btn_streamer_request') {
        const modal = new ModalBuilder()
            .setCustomId('modal_streamer_req')
            .setTitle('طلب رتبة Streamer');

        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('streamer_reason').setLabel('سبب التقديم').setStyle(TextInputStyle.Paragraph).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('streamer_subs').setLabel('عدد المتابعين').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('streamer_link').setLabel('رابط القناة').setStyle(TextInputStyle.Short).setRequired(true))
        );

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_streamer_req') {
        const reason = interaction.fields.getTextInputValue('streamer_reason');
        const subs = interaction.fields.getTextInputValue('streamer_subs');
        const channelLink = interaction.fields.getTextInputValue('streamer_link');

        const embed = new EmbedBuilder()
            .setTitle('🎥 طلب رتبة Streamer جديد')
            .setColor(config.colors.primary)
            .addFields(
                { name: '👤 العضو', value: `<@${interaction.user.id}> (\`${interaction.user.id}\`)`, inline: false },
                { name: '📊 عدد المتابعين', value: subs, inline: true },
                { name: '🔗 رابط القناة', value: channelLink, inline: true },
                { name: '📝 سبب التقديم', value: reason, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}` });

        const targetChannel = interaction.guild.channels.cache.get(config.bot.role_claim_channel_id) || interaction.channel;
        await targetChannel.send({ embeds: [embed] });

        await interaction.reply({ content: 'تم إرسال طلبك لتقديم رتبة Streamer بنجاح للإدارة!', ephemeral: true });
    }

    // --- د) التعميمات ---
    if (interaction.isButton() && interaction.customId === 'btn_create_announcement') {
        const modal = new ModalBuilder().setCustomId('modal_announcement').setTitle('إنشاء تعميم جديد');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('anc_msg').setLabel('نص الرسالة').setStyle(TextInputStyle.Paragraph).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('anc_channel').setLabel('أيدي الروم الذي سيرسل فيه التعميم').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('anc_image').setLabel('رابط الصورة (اختياري)').setStyle(TextInputStyle.Short).setRequired(false))
        );
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_announcement') {
        const msgText = interaction.fields.getTextInputValue('anc_msg');
        const channelId = interaction.fields.getTextInputValue('anc_channel');
        const imgUrl = interaction.fields.getTextInputValue('anc_image');

        const targetChannel = interaction.guild.channels.cache.get(channelId);
        if (!targetChannel) return interaction.reply({ content: 'لم يتم العثور على الروم!', ephemeral: true });

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(msgText)
            .setColor(config.colors.success);

        if (isValidUrl(imgUrl)) embed.setImage(imgUrl);

        await targetChannel.send({ content: '@everyone', embeds: [embed] });
        await interaction.reply({ content: 'تم إرسال التعميم بنجاح!', ephemeral: true });
    }

    // --- هـ) القوانين ---
    if (interaction.isStringSelectMenu() && interaction.customId === 'rules_select') {
        const choice = interaction.values[0];
        
        if (choice === 'rules_server') {
            const rulesText = 
`\`\`\`text
┣━━━━━━ [ EMS Family Rules ] ━━━━━━┫

💠 [1] - احترام الجميع : يجب احترام جميع الأعضاء وعدم استخدام اللغة المسيئة أو التهجم على الآخرين.

💠 [2] - حظر النشر : يمنع النشر بأي شكل من الأشكال (سيرفرات، حسابات شخصية).

💠 [3] - منع السب والتحريض : يمنع السب بجميع أشكاله والتحريض على المشاكل أو المظاهرات.

💠 [4] - مراعاة الآداب : يمنع التطرق إلى المواضيع الخارجة عن حدود الآداب العامة أو الشاذة.

💠 [5] - التزام المواضيع : يمنع مناقشة المواضيع السياسية، الدينية، العرقية، أو العنصرية.

💠 [6] - المواضيع الحساسة : يمنع الحديث عن أي إهانات مشفرة.

💠 [7] - الصور والأسماء : يمنع وضع صور أو أسماء مخالفة لآداب وعادات المجتمع.

💠 [8] - منع السبام : يمنع تكرار الكلام، الرسائل، النقاط، أو أي شكل من أشكال السبام.

💠 [9] - منع المضايقة : يمنع مضايقة الأعضاء حتى لو كان ذلك مزاحًا.

💠 [10] - احترام الإدارة : يمنع التدخل في قرارات الإدارة أو الاعتراض عليها بشكل يقلل منهم.

💠 [11] - حظر القذف : يمنع القذف كتابيًا أو صوتيًا وسيتعرض المخالف لأشد العقوبات.

💠 [12] - منع التظاهر : يمنع تظاهر الأعضاء كإدارة أو طلب والتلميح لرتب.

💠 [13] - منع الإعلانات : يمنع إرسال رسائل مكررة أو ترويج لخوادم Discord أخرى.

💠 [14] - مناقشة التحذيرات : يمنع مناقشة تحذيرات الإدارة في الشات العام.

💠 [15] - الإبلاغ عن المشاكل : في حال وجود شكوى، يرجى رفع تكت وعدم مناقشتها بالعام.

💠 [16] - تطبيق التحذيرات : يجب أخذ أي تحذير إداري بعين الاعتبار لتجنب العقوبات.
\`\`\``;

            const rulesEmbed = new EmbedBuilder()
                .setColor(config.colors?.primary || '#2b2d31')
                .setDescription(rulesText);

            await interaction.reply({ embeds: [rulesEmbed], ephemeral: true });
        }
    }

    // --- و) الاستدعاء ---
    if (interaction.isButton() && interaction.customId === 'btn_start_callup') {
        const modal = new ModalBuilder().setCustomId('modal_callup').setTitle('استدعاء عضو');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('callup_userid').setLabel('أيدي العضو المراد استدعاؤه').setStyle(TextInputStyle.Short).setRequired(true)));
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_callup') {
        const userId = interaction.fields.getTextInputValue('callup_userid');
        const targetMember = await interaction.guild.members.fetch(userId).catch(() => null);

        if (!targetMember) return interaction.reply({ content: 'لم يتم العثور على العضو!', ephemeral: true });

        if (config.bot.callup_role_id) await targetMember.roles.add(config.bot.callup_role_id).catch(() => {});

        const iconUrl = interaction.guild.iconURL() || '';
        const callupDmEmbed = new EmbedBuilder()
            .setTitle('تم استدعاءك')
            .setDescription('لقد تم استدعاءك من قبل الإدارة\n\nنتمنى منك التوجه إلى رومات الدعم الاستدعاء مباشرة ة\n\n[في حال عدم توجهك سيتم محاسبتك فوراً]')
            .setColor('#093a5b')
            .setTimestamp();

        if (isValidUrl(iconUrl)) callupDmEmbed.setThumbnail(iconUrl);

        await targetMember.send({ embeds: [callupDmEmbed] }).catch(() => {});

        const logEmbed = new EmbedBuilder()
            .setTitle('🚨 استدعاء')
            .setDescription(`تم استدعاء <@${targetMember.id}> بواسطة <@${interaction.user.id}>.\n\n**Status:**\n⏳ قيد الاستدعاء`)
            .setColor(config.colors.danger)
            .setFooter({ text: `${new Date().toLocaleString()}` });

        const btnEnd = new ButtonBuilder().setCustomId(`btn_end_callup_${targetMember.id}`).setLabel('إنهاء الاستدعاء').setStyle(ButtonStyle.Success);

        const logChannel = interaction.guild.channels.cache.get(config.bot.log_channel_id) || interaction.channel;
        await logChannel.send({ embeds: [logEmbed], components: [new ActionRowBuilder().addComponents(btnEnd)] });

        await interaction.reply({ content: `تم استدعاء <@${targetMember.id}> بنجاح!`, ephemeral: true });
    }

    if (interaction.isButton() && interaction.customId.startsWith('btn_end_callup_')) {
        const userId = interaction.customId.replace('btn_end_callup_', '');
        const targetMember = await interaction.guild.members.fetch(userId).catch(() => null);

        if (targetMember && config.bot.callup_role_id) await targetMember.roles.remove(config.bot.callup_role_id).catch(() => {});

        const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription(`تم استدعاء <@${userId}> بواسطة ${interaction.message.embeds[0].description.split('بواسطة ')[1].split('\n')[0]}\n\n**Status:**\n✅ تم الإنهاء بواسطة <@${interaction.user.id}>`);

        await interaction.update({ embeds: [updatedEmbed], components: [] });
    }

    // --- ز) نظام إرسال الرسائل الخاصة ---
    if (interaction.isButton() && interaction.customId === 'btn_start_dm_broadcast') {
        const modal = new ModalBuilder()
            .setCustomId('modal_dm_broadcast')
            .setTitle('إرسال رسالة خاصة للجميع');

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('dm_title')
                    .setLabel('عنوان الرسالة (Title)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('dm_message')
                    .setLabel('محتوى الرسالة (Message)')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('dm_image')
                    .setLabel('رابط الصورة المرفقة (اختياري)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            )
        );

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_dm_broadcast') {
        const title = interaction.fields.getTextInputValue('dm_title');
        const messageText = interaction.fields.getTextInputValue('dm_message');
        const imageUrl = interaction.fields.getTextInputValue('dm_image');

        await interaction.reply({ content: '⏳ جاري الإرسال لجميع الأعضاء في السيرفر...', ephemeral: true });

        const members = await interaction.guild.members.fetch();
        let successCount = 0;
        let failCount = 0;

        const dmEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(messageText)
            .setColor(config.colors?.primary || '#2b2d31')
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        if (isValidUrl(imageUrl)) {
            dmEmbed.setImage(imageUrl);
        }

        for (const [id, member] of members) {
            if (member.user.bot) continue;
            try {
                await member.send({ embeds: [dmEmbed] });
                successCount++;
            } catch {
                failCount++;
            }
        }

        await interaction.editReply({
            content: `✅ تم الانتهاء من عملية الإرسال!\n\n• **تم الإرسال بنجاح إلى:** \`${successCount}\` عضو.\n• **تعذر الإرسال إلى (الخاص مغلق):** \`${failCount}\` عضو.`
        });
    }
    const {
    ActivityType,
    GatewayIntentBits,
    Client,
    Events,
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    MediaGalleryItemBuilder
} = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

function isMainGuild(guildId) {
    if (!config.guildId) return true;
    return guildId === config.guildId;
}

function ltrEmbedMention(snippet) {
    if (snippet == null || snippet === '') return '—';
    return `\u200E${String(snippet)}\u200E`;
}

const guildInvites = new Map();

client.once(Events.ClientReady, (c) => {
    c.user.setActivity(String(config.activity?.name || '🧡 | Prime Core | 2026'), {
        type: ActivityType.Streaming,
        url: 'https://twitch.tv/3acommunity'
    });
    console.log(`[Welcome] Logged in as ${c.user.tag}`);
});

client.on('ready', async () => {
    for (const guild of client.guilds.cache.values()) {
        try {
            const firstInvites = await guild.invites.fetch();
            guildInvites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
        } catch (_) {}
    }
});

client.on('inviteCreate', (invite) => {
    const invites = guildInvites.get(invite.guild.id);
    if (invites) invites.set(invite.code, invite.uses);
});

client.on('guildMemberAdd', async member => {
    if (!config.welcome || !isMainGuild(member.guild.id)) return;
    const channel = member.guild.channels.cache.get(config.welcome.RoomWelcome);
    if (!channel) return;

    const memberNumber = member.guild.memberCount;
    let inviterTag = `<@${member.guild.ownerId}>`;

    try {
        const newInvites = await member.guild.invites.fetch();
        const oldInvites = guildInvites.get(member.guild.id) || new Map();
        const invite = newInvites.find(i => i.uses > (oldInvites.get(i.code) || 0));
        if (invite?.inviter?.id) inviterTag = `<@${invite.inviter.id}>`;
        guildInvites.set(member.guild.id, new Map(newInvites.map((inv) => [inv.code, inv.uses])));
    } catch (_) {}

    const createdAtUnix = Math.floor(member.user.createdTimestamp / 1000);
    const joinedAtUnix = Math.floor(member.joinedTimestamp / 1000);
    const welcomeTitle = config.welcome.TitleWelcome || `Welcome To ${member.guild.name}`;
    const poweredName = String(welcomeTitle).replace(/^welcome\s*to\s*/i, '').trim() || member.guild.name;
    const memberAvatar = member.user.displayAvatarURL({ dynamic: true, size: 256 });
    const bannerUrl = String(config.banner || '').trim();
    const safeBanner = /^https?:\/\//i.test(bannerUrl) ? bannerUrl : '';
    const accentColorRaw = String(config.welcome.setcolor || '#4cadd0').replace('#', '');
    const accentColor = /^[0-9a-fA-F]{6}$/.test(accentColorRaw) ? parseInt(accentColorRaw, 16) : 0x4cadd0;

    const welcomeContainer = new ContainerBuilder()
        .setAccentColor(accentColor)
        .addSectionComponents((section) =>
            section
                .addTextDisplayComponents((text) =>
                    text.setContent(`## ${welcomeTitle}\n### ${member.user.displayName || member.user.username}`)
                )
                .setThumbnailAccessory((img) => img.setURL(memberAvatar))
        )
        .addSeparatorComponents((s) => s.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents((t) =>
            t.setContent(
                [
                    `**Member :** ${ltrEmbedMention(`<@${member.id}>`)}   |   **Create Discord :** <t:${createdAtUnix}:R>`,
                    `**Members :**\u200E ${memberNumber}   |   **Joined Server :** <t:${joinedAtUnix}:R>`,
                    `**Invited By :**\u200E ${ltrEmbedMention(inviterTag)}`
                ].join('\n\n')
            )
        );

    if (safeBanner) {
        welcomeContainer.addMediaGalleryComponents((media) =>
            media.addItems(new MediaGalleryItemBuilder().setURL(safeBanner).setDescription('welcome-banner'))
        );
    }

    welcomeContainer
        .addSeparatorComponents((s) => s.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents((t) =>
            t.setContent(`Powered by ${poweredName}• Today at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`)
        );

    channel.send({
        components: [welcomeContainer],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { users: [member.id], roles: [], repliedUser: false }
    }).catch(() => {});
});
});
require('dotenv').config();

client.login(process.env.DISCORD_TOKEN);
