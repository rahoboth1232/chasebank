from django.db import models

from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum
from django.utils.timezone import now



# class Account(models.Model):
#     ACCOUNT_TYPES = [
#         ('checking', 'Checking'),
#         ('savings', 'Savings'),
#         ('investment', 'Investment'),
#     ]

#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="accounts")
#     name = models.CharField(max_length=100)  # TOTAL CHECKING, CHASE SAVINGS
#     account_number = models.CharField(max_length=20)  # ...5239
#     account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
#     balance = models.DecimalField(max_digits=15, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.name} ({self.account_number})"

#     def deposits_this_month(self):
#         return self.transactions.filter(
#             transaction_type='deposit',
#             created_at__month=now().month
#         ).aggregate(total=Sum('amount'))['total'] or 0

#     def withdrawals_this_month(self):
#         return self.transactions.filter(
#             transaction_type='withdrawal',
#             created_at__month=now().month
#         ).aggregate(total=Sum('amount'))['total'] or 0
# class Transaction(models.Model):
#     TRANSACTION_TYPES = [
#         ('deposit', 'Deposit'),
#         ('withdrawal', 'Withdrawal'),
#     ]

#     account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="transactions")
#     transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)
#     description = models.CharField(max_length=255, blank=True)

#     def __str__(self):
#         return f"{self.transaction_type} - {self.amount}"



from django.contrib.humanize.templatetags.humanize import intcomma
from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User

# Account Model with user reference
class Account(models.Model):
    ACCOUNT_TYPES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('investment', 'Investment'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    account_number = models.CharField(max_length=20, unique=True)
    deposits_this_month = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    withdrawals_this_month = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.account_type.capitalize()} Account - {self.account_number[-4:]}"

# Transaction Model with user reference via Account model
class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=[('deposit', 'Deposit'), ('withdrawal', 'Withdrawal')])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    # Access user via account
    @property
    def user(self):
        return self.account.user

    def __str__(self):
        return f"{self.transaction_type.capitalize()} - ${self.amount}"

# Offer Model with user reference
class Offer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="offers", null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    cash_back = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()

    def __str__(self):
        return self.title

    
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, EmailValidator
mobile_validator = RegexValidator(
    regex=r'^\(\d{3}\)-\d{3}-\d{4}$',
    message="Phone number must be in the format (123)-456-7890"
)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100, blank=True)
    mobile = models.CharField(max_length=15, validators=[mobile_validator])
    email = models.EmailField(
        max_length=100,
        validators=[EmailValidator(message="Enter a valid email address")],
        unique=True
    )
    ssn = models.CharField(
        max_length=9,
        validators=[RegexValidator(r'^\d{9}$', message="SSN must be exactly 9 digits")],
        verbose_name="Social Security Number",blank=True, null=True
    )
    date_of_birth = models.DateField(blank=True, null=True)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    address = models.TextField(
        blank=True,
        help_text="Full address (optional)"
    )

    
    def masked_ssn(self):
        if self.ssn and len(self.ssn) == 9:
            return "XXX-XX-" + self.ssn[-4:]

    def masked_mobile(self):
        if self.mobile and len(self.mobile) >= 4:
            return "(XXX)-XXX-" + self.mobile[-4:]

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.full_name and self.user:
            self.full_name = f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name or self.user.username



class Message(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="inbox_messages"
    )

    sender = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name="sent_messages",
          null=True, blank=True
    )

    title = models.CharField(max_length=255)
    body = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    

from django.db import models
from django.contrib.auth.models import User


from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class CashAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cash_accounts")
    date = models.DateField()
    account_number = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.CharField(max_length=255)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    account_balance = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0)
    class Meta:
        verbose_name = "Checking Accounts"
        verbose_name_plural = "Checking Accounts"

    def clean(self):
        # Ensure that only one of credit or debit is filled (non-zero)
        if (self.credit > 0 and self.debit > 0) or (self.credit == 0 and self.debit == 0):
            raise ValidationError("You must fill either Credit or Debit, but not both.")

    def save(self, *args, **kwargs):
     self.clean()  # Validate before saving
    
    # Get the last transaction for the user
     last_entry = CashAccount.objects.filter(user=self.user).order_by('-date', '-id').first()
     previous_balance = last_entry.account_balance if last_entry else 0
      
    # Calculate new balance
     self.account_balance = previous_balance + (self.credit or 0) - (self.debit or 0)
    
     super().save(*args, **kwargs)

def __str__(self):
    return f"{self.user.username} - {self.description}"

class SavingAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saving_accounts")
    date = models.DateField()
    account_number = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.CharField(max_length=255)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    account_balance = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0)
    class Meta:
        verbose_name = "Saving Account"
        verbose_name_plural = "Saving Accounts"

    def clean(self):
        if (self.credit > 0 and self.debit > 0) or (self.credit == 0 and self.debit == 0):
            raise ValidationError("You must fill either Credit or Debit, but not both.")

    def save(self, *args, **kwargs):
        self.clean()

        last_entry = SavingAccount.objects.filter(
            user=self.user
        ).order_by('-date', '-id').first()

        previous_balance = last_entry.account_balance if last_entry else 0

        self.account_balance = previous_balance + (self.credit or 0) - (self.debit or 0)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - Saving Account Transaction"


from decimal import Decimal, ROUND_HALF_UP
from django.db import models
from django.contrib.auth.models import User
from django.db import models

class LegalDocument(models.Model):
    DOCUMENT_TYPES = (
        ("PDF", "PDF"),
        ("PNG", "PNG"),
        ("JPEG", "JPEG"),
        ("DOCX", "DOCX"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    date = models.DateField()
    file = models.FileField(upload_to="legal_documents/")
    type = models.CharField(max_length=10, choices=DOCUMENT_TYPES, default="PDF")

    class Meta:
        ordering = ['-date', 'title']

    def __str__(self):
        return self.title


class BankAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=30)
    routing_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.bank_name} - ****{self.account_number[-4:]}"
    
class AccountTransfer(models.Model):
    from_account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="account_transfers_out"   # 🔧 CHANGED
    )
    to_account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="account_transfers_in"    # 🔧 CHANGED
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Account Transfer"
        verbose_name_plural = "Account Transfers"
class TransferRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    from_account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="transfer_requests_out"   # 🔧 CHANGED
    )

    to_bank = models.ForeignKey(
        BankAccount,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="bank_transfer_requests"  # 🔧 SAFE ADD
    )

    to_account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="transfer_requests_in"    # 🔧 CHANGED
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.amount} ({self.status})"


class AdminCompose(models.Model):
    SOURCE_CHOICES = (
        ("user", "User"),
        ("system", "System"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        help_text="User who triggered this message"
    )

    subject = models.CharField(max_length=255)
    message = models.TextField()

    source = models.CharField(
        max_length=10,
        choices=SOURCE_CHOICES,
        default="user"
    )

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Admin Message"
        verbose_name_plural = "Admin Messages"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.subject} - {self.user.username}"