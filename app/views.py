from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Account, UserProfile
from .serializers import UserProfileSerializer
from .models import SavingAccount
from django.contrib.humanize.templatetags.humanize import intcomma
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

def HomePage(request):
    return render(request, 'home.html')

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "accessToken": str(refresh.access_token),
            "refreshToken": str(refresh)
        })

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
    return Response({"error": "Invalid username or password"}, status=401)
from .models import CashAccount
from .models import Account, Transaction, Offer
from django.utils import timezone
from django.db.models import Sum


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone

from .models import Account, Offer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):

    current_month = timezone.now().month

    accounts = Account.objects.filter(user=request.user).annotate(

        deposits_month_total=Sum(
            "transaction__amount",
            filter=Q(
                transaction__transaction_type="deposit",
                transaction__date__month=current_month
            )
        ),

        withdrawals_month_total=Sum(
            "transaction__amount",
            filter=Q(
                transaction__transaction_type="withdrawal",
                transaction__date__month=current_month
            )
        )
    )

    account_data = [
        {
            "id": acc.id,
            "account_type":acc.account_type,   
            "account_number": acc.account_number,
            "balance": acc.balance,
            "deposits_month_total": acc.deposits_this_month or 0,
            "withdrawals_month_total": acc.withdrawals_this_month or 0,
        }
        for acc in accounts
    ]

    offers = Offer.objects.all().values(
        "id",
        "title",
        "description"
    )

    return Response({
        "accounts": account_data,
        "offers": list(offers)
    })


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import UserProfile
from .serializers import UserProfileSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):

    profile = get_object_or_404(UserProfile, user=request.user)

    serializer = UserProfileSerializer(profile)

    return Response(serializer.data)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_profile(request):

    profile = get_object_or_404(UserProfile, user=request.user)

    serializer = UserProfileSerializer(
        profile,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
def cash_account_list(request):
    cash_entries = CashAccount.objects.filter(user=request.user).order_by('-date', '-id')

    cash_accounts = Account.objects.filter(user=request.user, account_type="Checkings Account")

    cash_total = cash_entries.last().account_balance if cash_entries.exists() else 0
    formatted_cash_total = intcomma(cash_total)

    return render(request, "cash_account.html", {
        "cash_entries": cash_entries,
        "cash_accounts": cash_accounts,
        "cash_total": cash_total,
        "formatted_cash_total": formatted_cash_total,
    })


@login_required
def saving_account_list(request):
    saving_entries = SavingAccount.objects.filter(
        user=request.user
    ).order_by('-date', '-id')

    saving_total = saving_entries.last().account_balance if saving_entries.exists() else 0
    formatted_saving_total = intcomma(saving_total)
    saving_accounts = Account.objects.filter(user=request.user, account_type="Cash & Cash Equivalents")

    return render(request, "saving_account.html", {
        "saving_entries": saving_entries,
        "saving_total": saving_total,
        "formatted_saving_total": formatted_saving_total,
         "saving_accounts": saving_accounts,
    })

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import LegalDocument


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def legal_documents_view(request):

    query = request.GET.get("q", "").strip()

    docs = LegalDocument.objects.all()

    if query:
        docs = docs.filter(title__icontains=query)

    documents = [
        {
            "id": doc.id,
            "title": doc.title,
            "file": doc.file.url if doc.file else None,
        }
        for doc in docs
    ]

    return Response({
        "documents": documents,
        "query": query
    })


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CashAccount, SavingAccount, Account


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def activity_list(request):

    cash_entries = CashAccount.objects.filter(
        user=request.user
    ).order_by('-date', '-id')

    saving_entries = SavingAccount.objects.filter(
        user=request.user
    ).order_by('-date', '-id')

    checking_account = Account.objects.filter(
        user=request.user,
        account_type="Checkings Account"
    ).first()

    cash_equivalent_account = Account.objects.filter(
        user=request.user,
        account_type="Cash & Cash Equivalents"
    ).first()

    checking_acc_number = (
        checking_account.account_number if checking_account else ""
    )

    cash_equivalent_acc_number = (
        cash_equivalent_account.account_number if cash_equivalent_account else ""
    )

    entries = []

    for c in cash_entries:
        entries.append({
            "date": c.date,
            "description": c.description,
            "credit": c.credit,
            "debit": c.debit,
            "balance": c.account_balance,
            "entry_type": "Checkings Account",
            "account_number": checking_acc_number
        })

    for s in saving_entries:
        entries.append({
            "date": s.date,
            "description": s.description,
            "credit": s.credit,
            "debit": s.debit,
            "balance": s.account_balance,
            "entry_type": "Cash & Cash Equivalents",
            "account_number": cash_equivalent_acc_number
        })

    entries = sorted(entries, key=lambda x: x["date"], reverse=True)

    return Response({
        "entries": entries
    })
    
    


from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Account,
    BankAccount,
    CashAccount,
    TransferRequest
)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def transfer_view(request):

    user = request.user

    # GET → return data for page
    if request.method == "GET":

        accounts = Account.objects.filter(user=user)

        bank_accounts = BankAccount.objects.filter(
            user=user,
            is_active=True
        )

        transfer_requests = TransferRequest.objects.filter(
            user=user
        ).order_by("-created_at")

        cash_entries = CashAccount.objects.filter(user=user).order_by("-date")
        cash_total = cash_entries.first().account_balance if cash_entries.exists() else 0

        return Response({
            "accounts": [
                {
                    "id": acc.id,
                    "account_type": acc.account_type,
                    "account_number": acc.account_number,
                    "balance": acc.balance
                }
                for acc in accounts
            ],

            "bank_accounts": [
                {
                    "id": bank.id,
                    "bank_name": bank.bank_name,
                    "account_number": bank.account_number
                }
                for bank in bank_accounts
            ],

            "transfer_requests": [
                {
                    "id": tr.id,
                    "amount": tr.amount,
                    "status": tr.status,
                    "created_at": tr.created_at
                }
                for tr in transfer_requests
            ],

            "cash_total": cash_total
        })

    # POST → create transfer
    if request.method == "POST":

        action = request.data.get("action")
        from_id = request.data.get("from_account")
        to_id = request.data.get("to_account")
        bank_id = request.data.get("bank_account")
        amount_raw = request.data.get("amount")

        try:
            amount = Decimal(amount_raw)

            if amount <= 0:
                return Response(
                    {"error": "Invalid amount"},
                    status=400
                )

        except:
            return Response(
                {"error": "Invalid amount"},
                status=400
            )

        try:
            from_account = Account.objects.get(
                id=from_id,
                user=user
            )
        except Account.DoesNotExist:
            return Response(
                {"error": "Invalid source account"},
                status=400
            )

        if from_account.balance < amount:
            return Response(
                {"error": "Insufficient balance"},
                status=400
            )

        # Internal transfer
        if action == "internal":

            try:
                to_account = Account.objects.get(
                    id=to_id,
                    user=user
                )
            except Account.DoesNotExist:
                return Response(
                    {"error": "Invalid destination account"},
                    status=400
                )

            transfer = TransferRequest.objects.create(
                user=user,
                from_account=from_account,
                to_account=to_account,
                amount=amount,
                status="pending"
            )

        # Withdraw to bank
        elif action == "withdraw":

            try:
                bank_account = BankAccount.objects.get(
                    id=bank_id,
                    user=user,
                    is_active=True
                )
            except BankAccount.DoesNotExist:
                return Response(
                    {"error": "Invalid bank account"},
                    status=400
                )

            transfer = TransferRequest.objects.create(
                user=user,
                from_account=from_account,
                to_bank=bank_account,
                amount=amount,
                status="pending"
            )

        else:
            return Response(
                {"error": "Invalid transfer type"},
                status=400
            )

        return Response({
            "message": "Transfer request created",
            "transfer_id": transfer.id
        }, status=status.HTTP_201_CREATED)