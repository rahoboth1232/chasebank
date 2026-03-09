from django.contrib import admin

from django.contrib import admin
from .models import Account

from django.contrib import admin
from .models import Account 
from django.contrib import admin
from .models import Account, Transaction, Offer

# Register the Account model to the admin panel
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'account_type', 'balance', 'account_number', 'deposits_this_month', 'withdrawals_this_month')
    list_filter = ('account_type', 'user')
    search_fields = ('account_number', 'user__username')
    ordering = ('user',)

# Register the Transaction model to the admin panel
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('account', 'transaction_type', 'amount', 'date')
    list_filter = ('transaction_type', 'account')
    search_fields = ('account__account_number', 'transaction_type')
    ordering = ('-date',)

# Register the Offer model to the admin panel
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'cash_back', 'expiry_date')
    list_filter = ('expiry_date',)
    search_fields = ('title', 'description')

# Register the models with the admin site
admin.site.register(Account, AccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Offer, OfferAdmin)


from django.contrib import admin
from django.core.exceptions import ValidationError
from django import forms
from .models import UserProfile

class UserProfileAdminForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def clean_mobile(self):
        mobile = self.cleaned_data.get('mobile')
        
        import re
        pattern = r'^\+?[\d\s\-\(\)]{10,15}$'
        if not re.match(pattern, mobile):
            raise ValidationError("Enter a valid phone number (e.g. +1 (212) 555-1234 or 9876543210).")
        return mobile

    def clean_ssn(self):
        ssn = self.cleaned_data.get('ssn')
        # if not ssn.isdigit():
        #     raise ValidationError("SSN must contain digits only.")
        # if len(ssn) != 9:
        #     raise ValidationError("SSN must be exactly 9 digits.")
        return ssn


class UserProfileAdmin(admin.ModelAdmin):
    form = UserProfileAdminForm
    list_display = ('user', 'full_name', 'mobile', 'email', 'ssn', 'updated_at', 'address')
    search_fields = ('user__username', 'mobile', 'email','image','date_of_birth','address')

    def show_masked_ssn(self, obj):
        """Shows masked SSN in admin list but full in edit form"""
        return obj.masked_ssn()
    show_masked_ssn.short_description = "Masked SSN"
    def show_masked_mobile(self, obj):
        """Show only last 4 digits of phone number: XXX-XXX-1234"""
        return obj.masked_mobile()
    show_masked_mobile.short_description = "Masked Mobile"

admin.site.register(UserProfile, UserProfileAdmin)

from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "user", "sender", "date", "is_read")
    list_filter = ("is_read", "date")
    search_fields = ("title", "body", "user__username", "sender__username")

    

from django.contrib import admin
from django import forms
from .models import CashAccount

class CashAccountAdminForm(forms.ModelForm):
    class Meta:
        model = CashAccount
        fields = '__all__'
        readonly_fields = ("account_balance",)
        readonly_fields = ("account_",)
    def clean(self):
        cleaned_data = super().clean()
        credit = cleaned_data.get("credit", 0)
        debit = cleaned_data.get("debit", 0)
        if (credit > 0 and debit > 0) or (credit == 0 and debit == 0):
            raise forms.ValidationError("You must fill either Credit or Debit, but not both.")
        return cleaned_data

@admin.register(CashAccount)
class CashAccountAdmin(admin.ModelAdmin):
    form = CashAccountAdminForm
    list_display = ('user', 'date', 'account_number', 'description', 'credit', 'debit', 'account_balance')
    list_filter = ('user', 'date')
    search_fields = ('user__username', 'description', 'account_number')

from django.contrib import admin
from .models import SavingAccount

@admin.register(SavingAccount)
class SavingAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'account_number', 'credit', 'debit', 'account_balance')
    list_filter = ('user', 'date')
    search_fields = ('user__username', 'account_number', 'description')


from django.contrib import admin
from .models import LegalDocument

@admin.register(LegalDocument)
class LegalDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'user', 'date', 'type')
    list_filter = ('type', 'date', 'user')
    search_fields = ('title', 'slug', 'user__username')
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ('user',)

    from django.contrib import admin
from .models import BankAccount

from django.contrib import admin
from .models import BankAccount


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'bank_name',
        'masked_account_number',
        'routing_number',
        'is_active',
    )

    list_filter = ('bank_name', 'is_active')
    search_fields = ('bank_name', 'account_number', 'routing_number')

    def masked_account_number(self, obj):
        if obj.account_number:
            return f"****{obj.account_number[-4:]}"
        return "N/A"

    masked_account_number.short_description = "Account Number"
from django.contrib import admin
from django.db import transaction
from django.contrib import messages
from .models import BankAccount, TransferRequest, AccountTransfer

@admin.register(TransferRequest)
class TransferRequestAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'from_account',
        'to_account',
        'amount',
        'status',
        'created_at',
    )

    list_filter = ('status', 'created_at')
    actions = ['approve_transfer', 'reject_transfer']

    @admin.action(description="Approve selected transfer requests")
    def approve_transfer(self, request, queryset):
        for tr in queryset.filter(status='pending'):
            account = tr.from_account

            if account.balance < tr.amount:
                messages.error(
                    request,
                    f"Insufficient balance for {tr.user}"
                )
                continue

            with transaction.atomic():
                # deduct money
                account.balance -= tr.amount
                account.save()

                # mark approved
                tr.status = 'approved'
                tr.save()

        self.message_user(request, "Selected transfers approved successfully")

    @admin.action(description="Reject selected transfer requests")
    def reject_transfer(self, request, queryset):
        queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, "Selected transfers rejected")


from .models import AdminCompose
@admin.register(AdminCompose)
class AdminComposeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "subject",
        "source",
        "is_read",
        "created_at",
    )

    list_filter = ("source", "is_read")
    search_fields = ("subject", "message", "user__username")
    readonly_fields = ("created_at",)

    actions = ["mark_as_read"]

import csv
from django.http import HttpResponse
from django.contrib import admin
from .models import CDAccount
from django.utils import timezone
import csv
from django.http import HttpResponse
from django.contrib import admin
from .models import CDAccount
from django.utils import timezone




def export_cd_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="cd_accounts.csv"'

    writer = csv.writer(response)
    writer.writerow([
        "User",
        "Principal",
        "Interest Rate",
        "Duration (Years)",
        "Maturity Amount",
        "Maturity Date",
        "Status"
    ])

    for cd in queryset:
        writer.writerow([
            cd.user.username,
            cd.principal_amount,
            cd.interest_rate,
            cd.duration_years,
            cd.maturity_amount,
            cd.maturity_date,
            cd.status
        ])

    return response

export_cd_csv.short_description = "Export selected CDs to CSV"

@admin.register(CDAccount)
class CDAccountAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "principal_amount",
        "interest_rate",
        "duration_years",
        "maturity_amount",
        "maturity_date",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "duration_years",
        "interest_rate",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    actions = [export_cd_csv]

    readonly_fields = (
        "maturity_amount",
        "start_date",
        "created_at",
        "status",
    )

    ordering = ("-created_at",)

    fieldsets = (
        ("User", {
            "fields": ("user",)
        }),
        ("CD Details", {
            "fields": (
                "principal_amount",
                "interest_rate",
                "duration_years",
            )
        }),
        ("Calculated Info", {
            "fields": (
                "maturity_amount",
                "maturity_date",
                "status",
            )
        }),
        ("Timestamps", {
            "fields": (
                "start_date",
                "created_at",
            )
        }),
    )

    def has_delete_permission(self, request, obj=None):
        """
        Prevent deleting matured CDs
        """
        if obj and obj.status == "MATURED":
            return False
        return super().has_delete_permission(request, obj)

    def save_model(self, request, obj, form, change):
        """
        Lock principal/rate/duration after creation
        """
        if change:
            old_obj = CDAccount.objects.get(pk=obj.pk)
            obj.principal_amount = old_obj.principal_amount
            obj.interest_rate = old_obj.interest_rate
            obj.duration_years = old_obj.duration_years

        obj.maturity_amount = obj.calculate_maturity_amount()
        super().save_model(request, obj, form, change)
